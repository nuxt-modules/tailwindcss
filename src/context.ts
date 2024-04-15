import { getContext } from 'unctx'
import { addTemplate, createResolver, updateTemplates, useNuxt } from '@nuxt/kit'
import { join, relative } from 'pathe'
import _loadConfig from 'tailwindcss/loadConfig.js'
import resolveConfig from 'tailwindcss/resolveConfig.js'
import type { ModuleOptions, TWConfig } from './types'
import { resolveModulePaths } from './resolvers'
import logger from './logger'
import configMerger from './runtime/merger.mjs'

const CONFIG_TEMPLATE_NAME = 'tailwind.config.cjs'

const twCtx = getContext<TWConfig>('twcss')
const { tryUse, set } = twCtx
twCtx.tryUse = () => {
  const ctx = tryUse()

  if (!ctx) {
    try {
      return resolveConfig(_loadConfig(join(useNuxt().options.buildDir, CONFIG_TEMPLATE_NAME))) as unknown as TWConfig
    }
    catch { /* empty */ }
  }

  return ctx
}
twCtx.set = (instance, replace = true) => {
  const resolvedConfig = instance && resolveConfig(instance)
  resolvedConfig && useNuxt().callHook('tailwindcss:resolvedConfig', resolvedConfig, twCtx.tryUse() ?? undefined)

  set(resolvedConfig as unknown as TWConfig, replace)
}

const createInternalContext = async (moduleOptions: ModuleOptions, nuxt = useNuxt()) => {
  const [configPaths, contentPaths] = await resolveModulePaths(moduleOptions.configPath, nuxt)
  const configUpdatedHook: Record<string, string> = {}
  const configResolvedPath = join(nuxt.options.buildDir, CONFIG_TEMPLATE_NAME)

  const trackProxy = (configPath: string, path: (string | symbol)[] = []): ProxyHandler<Partial<TWConfig>> => ({
    get: (target, key: string) => {
      return (typeof target[key] === 'object' && target[key] !== null)
        ? new Proxy(target[key], trackProxy(configPath, path.concat(key)))
        : target[key]
    },

    set(target, key, value) {
      const resultingCode = `cfg${path.concat(key).map(k => `[${JSON.stringify(k)}]`).join('')} = ${JSON.stringify(value)};`

      if (JSON.stringify(target[key as string]) === JSON.stringify(value) || configUpdatedHook[configPath].endsWith(resultingCode)) {
        return Reflect.set(target, key, value)
      }

      if (key === 'plugins' && typeof value === 'function') {
        logger.warn(
          'You have injected a functional plugin into your Tailwind Config which cannot be serialized.',
          'Please use a configuration file/template instead.',
        )
        // return false // removed for backwards compatibility
      }

      configUpdatedHook[configPath] += resultingCode
      return Reflect.set(target, key, value)
    },

    deleteProperty(target, key) {
      configUpdatedHook[configPath] += `delete cfg${path.concat(key).map(k => `[${JSON.stringify(k)}]`).join('')};`
      return Reflect.deleteProperty(target, key)
    },
  })

  const loadConfig = async () => {
    configPaths.forEach(p => configUpdatedHook[p] = '')

    const tailwindConfig = await Promise.all((
      configPaths.map(async (configPath, idx, paths) => {
        let _tailwindConfig: Partial<TWConfig> | undefined

        try {
          _tailwindConfig = configMerger(undefined, _loadConfig(configPath))
        }
        catch (e) {
          if (!configPath.startsWith(nuxt.options.buildDir)) {
            configUpdatedHook[configPath] = 'return {};'
            logger.warn(`Failed to load Tailwind config at: \`./${relative(nuxt.options.rootDir, configPath)}\``, e)
          }
          else {
            configUpdatedHook[configPath] = nuxt.options.dev ? 'return {};' : ''
          }
        }

        // Transform purge option from Array to object with { content }
        if (_tailwindConfig?.purge && !_tailwindConfig.content) {
          configUpdatedHook[configPath] += 'cfg.content = cfg.purge;'
        }

        await nuxt.callHook('tailwindcss:loadConfig', _tailwindConfig && new Proxy(_tailwindConfig, trackProxy(configPath)), configPath, idx, paths)
        return _tailwindConfig || {}
      })),
    ).then(configs => configs.reduce(
      (prev, curr) => configMerger(curr, prev),
      // internal default tailwind config
      configMerger(moduleOptions.config, { content: contentPaths }),
    )) as TWConfig

    // Allow extending tailwindcss config by other modules
    configUpdatedHook['main-config'] = ''
    await nuxt.callHook('tailwindcss:config', new Proxy(tailwindConfig, trackProxy('main-config')))
    twCtx.set(tailwindConfig)

    return tailwindConfig
  }

  const generateConfig = () => addTemplate({
    filename: CONFIG_TEMPLATE_NAME,
    write: true,
    getContents: () => {
      const serializeConfig = <T extends Partial<TWConfig>>(config: T) =>
        JSON.stringify(
          Array.isArray(config.plugins) && config.plugins.length > 0 ? configMerger({ plugins: (defaultPlugins: TWConfig['plugins']) => defaultPlugins?.filter(p => p && typeof p !== 'function') }, config) : config,
          (_, v) => typeof v === 'function' ? `() => (${JSON.stringify(v())})` : v).replace(/"(\(\) => \(.*\))"/g, (_, substr) => substr.replace(/\\"/g, '"'),
        )

      const layerConfigs = configPaths.map((configPath) => {
        const configImport = `require(${JSON.stringify(/[/\\]node_modules[/\\]/.test(configPath) ? configPath : './' + relative(nuxt.options.buildDir, configPath))})`
        return configUpdatedHook[configPath] ? configUpdatedHook[configPath].startsWith('return {};') ? '' : `(() => {const cfg=configMerger(undefined, ${configImport});${configUpdatedHook[configPath]};return cfg;})()` : configImport
      }).filter(Boolean)

      return [
        `// generated by the @nuxtjs/tailwindcss <https://github.com/nuxt-modules/tailwindcss> module at ${(new Date()).toLocaleString()}`,
        `const configMerger = require(${JSON.stringify(createResolver(import.meta.url).resolve('./runtime/merger.mjs'))});`,
        `\nconst inlineConfig = ${serializeConfig(moduleOptions.config as Partial<TWConfig>)};\n`,
        'const config = [',
        layerConfigs.join(',\n'),
        `].reduce((prev, curr) => configMerger(curr, prev), configMerger(inlineConfig, { content: ${JSON.stringify(contentPaths)} }));\n`,
        `module.exports = ${configUpdatedHook['main-config'] ? `(() => {const cfg=config;${configUpdatedHook['main-config']};return cfg;})()` : 'config'}\n`,
      ].join('\n')
    },
  })

  const registerHooks = () => {
    nuxt.hook('app:templatesGenerated', async (_app, templates) => {
      if (templates.some(t => configPaths.includes(t.dst))) {
        await loadConfig()
        setTimeout(async () => {
          await updateTemplates({ filter: t => t.filename === CONFIG_TEMPLATE_NAME })
          await nuxt.callHook('tailwindcss:internal:regenerateTemplates', { configTemplateUpdated: true })
        }, 100)
      }
    })

    nuxt.hook('vite:serverCreated', (server) => {
      nuxt.hook('tailwindcss:internal:regenerateTemplates', (data) => {
        if (!data || !data.configTemplateUpdated) return
        const configFile = server.moduleGraph.getModuleById(configResolvedPath)
        configFile && server.moduleGraph.invalidateModule(configFile)
      })
    })

    moduleOptions.exposeConfig && nuxt.hook('builder:watch', async (_, path) => {
      if (configPaths.includes(join(nuxt.options.rootDir, path))) {
        twCtx.set(_loadConfig(configResolvedPath))
        setTimeout(async () => {
          await nuxt.callHook('tailwindcss:internal:regenerateTemplates')
        }, 100)
      }
    })
  }

  return {
    loadConfig,
    generateConfig,
    registerHooks,
  }
}

export { twCtx, createInternalContext }
