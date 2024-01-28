import { relative } from 'pathe'
import { addTemplate, createResolver, useNuxt } from '@nuxt/kit'
import loadConfig from 'tailwindcss/loadConfig.js'
import logger from './logger'
import { resolveModulePaths } from './resolvers'
import type { ModuleHooks, ModuleOptions, TWConfig } from './types'
import configMerger from './runtime/merger.mjs'

type PartialTWConfig = Partial<TWConfig>

const makeHandler = <T extends PartialTWConfig>(proxyConfig: T, path: string[] = []): ProxyHandler<T> => ({
  get: (target, key: string) => {
    return (typeof target[key] === 'object' && target[key] !== null)
      ? new Proxy(target[key], makeHandler(proxyConfig, path.concat(key)))
      : target[key]
  },

  set(target, key: string, value) {
    if ((Array.isArray(target) && key === 'length') || JSON.stringify(target[key]) === JSON.stringify(value)) {
      return Reflect.set(target, key, value)
    }

    let result = typeof target[key] === 'object' && !Array.isArray(target[key])? () => value : value;
    (Array.isArray(target) ? path : path.concat(key)).reverse().forEach((k, idx) => {
      result = { [k]: Array.isArray(target) && idx === 0 ? [result] : result }
    })

    // @ts-ignore
    Object.entries(configMerger(proxyConfig, result)).forEach(([k, v]) => proxyConfig[k] = v)
    return Reflect.set(target, key, value)
  }
})

const serializeConfig = <T extends PartialTWConfig>(config: T) =>
  JSON.stringify(
    configMerger({ plugins: () => [] }, config),
    (_, v) => typeof v === 'function' ? `() => (${JSON.stringify(v())})` : v).replace(/"(\(\) => \(.*\))"/g, (_, substr) => substr.replace(/\\"/g, '"')
  )

/**
 * Loads all possible Tailwind CSS configuration for a Nuxt project.
 *
 * @param moduleOptions configuration for the module
 * @param nuxt nuxt app
 *
 * @returns template with all configs handled
 */
export default async function loadTwConfig(moduleOptions: ModuleOptions, nuxt = useNuxt()) {
  const { resolve } = createResolver(import.meta.url)
  const [configPaths, contentPaths] = await resolveModulePaths(moduleOptions.configPath, nuxt)
  const configProxies: [string, PartialTWConfig][] = configPaths.map((configPath) => [configPath, {}])

  const tailwindConfig = await Promise.all((
    configPaths.map(async (configPath, idx, paths) => {
      let _tailwindConfig: PartialTWConfig | undefined

      try {
        _tailwindConfig = loadConfig(configPath)
      } catch (e) {
        logger.warn(`Failed to load Tailwind config at: \`./${relative(nuxt.options.rootDir, configPath)}\``, e)
      }

      // Transform purge option from Array to object with { content }
      if (_tailwindConfig && !_tailwindConfig.content) {
        configProxies[idx][1].content = _tailwindConfig.purge
      }

      await nuxt.callHook('tailwindcss:loadConfig', _tailwindConfig && new Proxy(_tailwindConfig, makeHandler(configProxies[idx][1])), configPath, idx, paths)
      return _tailwindConfig || {}
    }))
  ).then((configs) => configs.reduce(
    (prev, curr) => configMerger(curr, prev),
    // internal default tailwind config
    configMerger(moduleOptions.config, { content: contentPaths })
  )) as TWConfig

  // Allow extending tailwindcss config by other modules
  const configProxy: PartialTWConfig = {}
  await nuxt.callHook('tailwindcss:config', new Proxy(tailwindConfig, makeHandler(configProxy)))

  const template = addTemplate({
    filename: 'tailwind.config.cjs',
    write: true,
    getContents: () => {
      return [
        `const configMerger = require(${JSON.stringify(resolve('./runtime/merger.mjs'))});`,
        configPaths.map((p, idx) => `const cfg${idx} = require(${JSON.stringify(/[/\\]node_modules[/\\]/.test(p) ? p : './' + relative(nuxt.options.buildDir, p))});`).join('\n'),
        `\nconst inlineConfig = ${serializeConfig(moduleOptions.config as PartialTWConfig)};\n`,
        'const config = [',
        configProxies.map(([_, p], idx) => `  configMerger(${serializeConfig(p)}, cfg${idx})`).join(', \n'),
        `].reduce((prev, curr) => configMerger(curr, prev), configMerger(inlineConfig, { content: ${JSON.stringify(contentPaths)} }));\n`,
        `module.exports = configMerger(${serializeConfig(configProxy)}, config);\n`
      ].join('\n')
    }
  })

  return {
    template,
    tailwindConfig,
    configPaths,
  }
}

declare module 'nuxt/schema' {
  interface NuxtHooks extends ModuleHooks {}
}

declare module '@nuxt/schema' {
  interface NuxtHooks extends ModuleHooks {}
}
