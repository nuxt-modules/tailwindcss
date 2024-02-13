import { relative } from 'pathe'
import { addTemplate, createResolver, useNuxt } from '@nuxt/kit'
import loadConfig from 'tailwindcss/loadConfig.js'
import logger from './logger'
import { resolveModulePaths } from './resolvers'
import type { ModuleHooks, ModuleOptions, TWConfig } from './types'
import configMerger from './runtime/merger.mjs'

type PartialTWConfig = Partial<TWConfig>

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
  const configUpdatedHook = Object.fromEntries(configPaths.map((p) => [p, '']))

  const makeHandler = (configPath: string, path: (string | symbol)[] = []): ProxyHandler<PartialTWConfig> => ({
    get: (target, key: string) => {
      return (typeof target[key] === 'object' && target[key] !== null)
        ? new Proxy(target[key], makeHandler(configPath, path.concat(key)))
        : target[key]
    },

    set(target, key, value) {
      if (key === 'plugins' && typeof value === 'function') {
        logger.warn(
          'You have injected a functional plugin into your Tailwind Config which cannot be serialized.',
          'Please use a configuration file/template instead.'
        )
        return false
      }

      if (JSON.stringify(target[key as string]) === JSON.stringify(value)) {
        return Reflect.set(target, key, value)
      }

      configUpdatedHook[configPath] += `cfg[${path.concat(key).map((k) => JSON.stringify(k)).join('][')}] = ${JSON.stringify(value)};`
      return Reflect.set(target, key, value)
    },

    deleteProperty(target, key) {
      configUpdatedHook[configPath] += `delete cfg[${path.concat(key).map((k) => JSON.stringify(k)).join('][')}];`
      return Reflect.deleteProperty(target, key)
    },
  })

  const serializeConfig = <T extends PartialTWConfig>(config: T) =>
    JSON.stringify(
      Array.isArray(config.plugins) && config.plugins.length > 0 ? configMerger({ plugins: (defaultPlugins: TWConfig['plugins']) => defaultPlugins?.filter((p) => p && typeof p !== 'function') }, config) : config,
      (_, v) => typeof v === 'function' ? `() => (${JSON.stringify(v())})` : v).replace(/"(\(\) => \(.*\))"/g, (_, substr) => substr.replace(/\\"/g, '"')
    )

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
        configUpdatedHook[configPath] = 'cfg.content = cfg.purge;'
      }

      await nuxt.callHook('tailwindcss:loadConfig', _tailwindConfig && new Proxy(_tailwindConfig, makeHandler(configPath)), configPath, idx, paths)
      return _tailwindConfig || {}
    }))
  ).then((configs) => configs.reduce(
    (prev, curr) => configMerger(curr, prev),
    // internal default tailwind config
    configMerger(moduleOptions.config, { content: contentPaths })
  )) as TWConfig

  // Allow extending tailwindcss config by other modules
  configUpdatedHook['main-config'] = ''
  await nuxt.callHook('tailwindcss:config', new Proxy(tailwindConfig, makeHandler('main-config')))

  const template = addTemplate({
    filename: 'tailwind.config.cjs',
    write: true,
    getContents: () => {
      const layerConfigs = configPaths.map((configPath) => {
        const configImport = `require(${JSON.stringify(/[/\\]node_modules[/\\]/.test(configPath) /* || configPath.startsWith(nuxt.options.buildDir) */ ? configPath : './' + relative(nuxt.options.buildDir, configPath))})`
        return configUpdatedHook[configPath] ? `(() => {const cfg=${configImport};${configUpdatedHook[configPath]};return cfg;})()` : configImport
      })

      return [
        `const configMerger = require(${JSON.stringify(resolve('./runtime/merger.mjs'))});`,
        `\nconst inlineConfig = ${serializeConfig(moduleOptions.config as PartialTWConfig)};\n`,
        'const config = [',
        layerConfigs.join(',\n'),
        `].reduce((prev, curr) => configMerger(curr, prev), configMerger(inlineConfig, { content: ${JSON.stringify(contentPaths)} }));\n`,
        `module.exports = ${configUpdatedHook['main-config'] ? `(() => {const cfg=config;${configUpdatedHook['main-config']};return cfg;})()` : 'config'}\n`
      ].join('\n')
    }
  })

  return {
    template,
    tailwindConfig,
    configPaths,
  }
  // new Proxy(tailwindConfig, {
  //   get: (target, key: string) => {
  //     if (key in template) {
  //       return template[key as keyof typeof template]
  //     }
  //     switch (key) {
  //       case 'configPaths':
  //         return configPaths
  //       case 'load':
  //         return () => loadConfig(template.dst)
  //       default:
  //         return target[key]
  //     }
  //   }
  // })
}

declare module 'nuxt/schema' {
  interface NuxtHooks extends ModuleHooks {}
}

declare module '@nuxt/schema' {
  interface NuxtHooks extends ModuleHooks {}
}
