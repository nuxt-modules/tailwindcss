import { relative } from 'pathe'
import { addTemplate, createResolver, useNuxt } from '@nuxt/kit'
import resolveConfig from 'tailwindcss/resolveConfig'
import loadConfig from 'tailwindcss/loadConfig'
import logger from './logger'
import { resolveModulePaths } from './resolvers'
import type { ModuleHooks, ModuleOptions, ResolvedTwConfig, TWConfig } from './types'
import { configMerger } from './runtime/merger.mjs'

type PartialTWConfig = Partial<TWConfig>

const makeHandler = <T extends PartialTWConfig>(proxyConfig: T, path: string[] = []): ProxyHandler<T> => ({
  get: (target, key: string) => {
    return (typeof target[key] === 'object' && target[key] !== null)
      ? new Proxy(target[key], makeHandler(proxyConfig, path.concat(key)))
      : target[key]
  },

  set(target, key: string, value) {
    if ((Array.isArray(target) && key === 'length') || JSON.stringify(target[key]) === JSON.stringify(value)) {
      return Reflect.set(target, key, value);
    }

    let result = value;
    (Array.isArray(target) ? path : path.concat(key)).reverse().forEach((k, idx) => {
      result = { [k]: Array.isArray(target) && idx === 0 ? [result] : result }
    })

    // @ts-ignore
    Object.entries(configMerger(proxyConfig, result)).forEach(([k, v]) => proxyConfig[k] = v)
    return Reflect.set(target, key, value)
  }
})

/**
 * Loads all possible Tailwind CSS configuration for a Nuxt project.
 *
 * @param moduleOptions configuration for the module
 * @param nuxt nuxt app
 * 
 * @returns template with all configs handled
 */
export default async function loadTwConfig(moduleOptions: ModuleOptions, nuxt = useNuxt()) {
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
        _tailwindConfig.content = _tailwindConfig.purge
      }

      await nuxt.callHook('tailwindcss:loadConfig', _tailwindConfig && new Proxy(_tailwindConfig, makeHandler(configProxies[idx][1])), configPath, idx, paths)
      return _tailwindConfig || {}
    }))
  ).then((configs) => configs.reduce(
    (prev, curr) => configMerger(curr, prev),
    // internal default tailwind config
    configMerger(moduleOptions.config, { content: contentPaths })
  ))

  // Allow extending tailwindcss config by other modules
  const configProxy: PartialTWConfig = {}
  await nuxt.callHook('tailwindcss:config', new Proxy(tailwindConfig, makeHandler(configProxy)))

  const resolvedConfig = resolveConfig(tailwindConfig as TWConfig)
  const resolvedConfigProxy: PartialTWConfig = {}
  await nuxt.callHook('tailwindcss:resolvedConfig', new Proxy(resolvedConfig, makeHandler(resolvedConfigProxy) as unknown as ProxyHandler<ResolvedTwConfig>))

  const mergerTemplate = addTemplate({ src: createResolver(import.meta.url).resolve('./runtime/merger.mjs'), write: true })

  return {
    template: addTemplate({
      filename: 'tailwind.config.mjs',
      write: true,
      getContents: () => {
        return [
          `import { configMerger } from ${JSON.stringify(mergerTemplate.dst)};`,
          configPaths.map((p, idx) => `import cfg${idx} from ${JSON.stringify(relative(nuxt.options.buildDir, p))};`).join('\n'),
          `\nconst inlineConfig = ${JSON.stringify(moduleOptions.config)};\n`,
          `const config = [`,
          `  ${JSON.stringify(resolvedConfigProxy)},`,
          `  ${JSON.stringify(configProxy)},`,
          configProxies.map(([_, p], idx) => `  configMerger(${JSON.stringify(p)}, cfg${idx})`).join(', \n'),
          `].reduce((prev, curr) => configMerger(curr, prev), configMerger(inlineConfig, { content: ${JSON.stringify(contentPaths)} }));\n`,
          `export default config;`
        ].join('\n')
      }
    }),
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
