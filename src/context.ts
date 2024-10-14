import { getContext } from 'unctx'
import { addTemplate, createResolver, updateTemplates, useNuxt } from '@nuxt/kit'
import { join, relative } from 'pathe'
import _loadConfig from 'tailwindcss/loadConfig.js'
import resolveConfig from 'tailwindcss/resolveConfig.js'
import type { ModuleOptions, TWConfig } from './types'
import { resolveModulePaths } from './resolvers'
import logger from './logger'
import configMerger from './runtime/merger.js'

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
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  resolvedConfig && useNuxt().callHook('tailwindcss:resolvedConfig', resolvedConfig, twCtx.tryUse() ?? undefined)

  set(resolvedConfig as unknown as TWConfig, replace)
}

const unsafeInlineConfig = (inlineConfig: ModuleOptions['config']) => {
  if (!inlineConfig) return

  if (
    'plugins' in inlineConfig && Array.isArray(inlineConfig.plugins)
    && inlineConfig.plugins.find(p => typeof p === 'function' || typeof p?.handler === 'function')
  ) {
    return 'plugins'
  }

  if (inlineConfig.content) {
    const invalidProperty = ['extract', 'transform'].find(i => i in inlineConfig.content! && typeof inlineConfig.content![i as keyof ModuleOptions['config']['content']] === 'function')

    if (invalidProperty) {
      return `content.${invalidProperty}`
    }
  }

  if (inlineConfig.safelist) {
    // @ts-expect-error `s` is never
    const invalidIdx = inlineConfig.safelist.findIndex(s => typeof s === 'object' && s.pattern instanceof RegExp)

    if (invalidIdx > -1) {
      return `safelist[${invalidIdx}]`
    }
  }
}

const JSONStringifyWithRegex = (obj: any) => JSON.stringify(obj, (_, v) => v instanceof RegExp ? `__REGEXP ${v.toString()}` : v)

const createInternalContext = async (moduleOptions: ModuleOptions, nuxt = useNuxt()) => {
  const [configPaths, contentPaths] = await resolveModulePaths(moduleOptions.configPath, nuxt)
  const configUpdatedHook: Record<string, string> = {}
  const configResolvedPath = join(nuxt.options.buildDir, CONFIG_TEMPLATE_NAME)
  let enableHMR = true

  if (moduleOptions.disableHMR) {
    enableHMR = false
  }

  const unsafeProperty = unsafeInlineConfig(moduleOptions.config)
  if (unsafeProperty && enableHMR) {
    logger.warn(
      `The provided Tailwind configuration in your \`nuxt.config\` is non-serializable. Check \`${unsafeProperty}\`. Falling back to providing the loaded configuration inlined directly to PostCSS loader..`,
      'Please consider using `tailwind.config` or a separate file (specifying in `configPath` of the module options) to enable it with additional support for IntelliSense and HMR. Suppress this warning with `quiet: true` in the module options.',
    )
    enableHMR = false
  }

  const trackObjChanges = (configPath: string, path: (string | symbol)[] = []): ProxyHandler<Partial<TWConfig>> => ({
    get: (target, key: string) => {
      return (typeof target[key] === 'object' && target[key] !== null)
        ? new Proxy(target[key], trackObjChanges(configPath, path.concat(key)))
        : target[key]
    },

    set(target, key, value) {
      const cfgKey = path.concat(key).map(k => `[${JSON.stringify(k)}]`).join('')
      const resultingCode = `cfg${cfgKey} = ${JSONStringifyWithRegex(value)?.replace(/"__REGEXP (.*)"/g, (_, substr) => substr.replace(/\\"/g, '"')) || `cfg${cfgKey}`};`
      const functionalStringify = (val: any) => JSON.stringify(val, (_, v) => ['function'].includes(typeof v) ? CONFIG_TEMPLATE_NAME + 'ns' : v)

      if (functionalStringify(target[key as string]) === functionalStringify(value) || configUpdatedHook[configPath].endsWith(resultingCode)) {
        return Reflect.set(target, key, value)
      }

      if (functionalStringify(value).includes(`"${CONFIG_TEMPLATE_NAME + 'ns'}"`) && enableHMR) {
        logger.warn(
          `A hook has injected a non-serializable value in \`config${cfgKey}\`, so the Tailwind Config cannot be serialized. Falling back to providing the loaded configuration inlined directly to PostCSS loader..`,
          'Please consider using a configuration file/template instead (specifying in `configPath` of the module options) to enable additional support for IntelliSense and HMR.',
        )
        enableHMR = false
      }

      if (JSONStringifyWithRegex(value).includes('__REGEXP') && enableHMR) {
        logger.warn(`A hook is injecting RegExp values in your configuration (check \`config${cfgKey}\`) which may be unsafely serialized. Consider moving your safelist to a separate configuration file/template instead (specifying in \`configPath\` of the module options)`)
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
        const _tailwindConfig = ((): Partial<TWConfig> | undefined => {
          try {
            return configMerger(undefined, _loadConfig(configPath))
          }
          catch (e) {
            const error = e instanceof Error ? ('code' in e ? e.code as string : e.name).toUpperCase() : typeof e === 'string' ? e.toUpperCase() : ''

            if (configPath.startsWith(nuxt.options.buildDir) && ['MODULE_NOT_FOUND'].includes(error)) {
              configUpdatedHook[configPath] = nuxt.options.dev ? 'return {};' : ''
              return
            }

            configUpdatedHook[configPath] = 'return {};'
            logger.warn(`Failed to load config \`./${relative(nuxt.options.rootDir, configPath)}\` due to the error below. Skipping..\n`, e)
          }
        })()

        // Transform purge option from Array to object with { content }
        if (_tailwindConfig?.purge && !_tailwindConfig.content) {
          configUpdatedHook[configPath] += 'cfg.content = cfg.purge;'
        }

        await nuxt.callHook('tailwindcss:loadConfig', _tailwindConfig && new Proxy(_tailwindConfig, trackObjChanges(configPath)), configPath, idx, paths)
        return _tailwindConfig || {}
      })),
    ).then(configs => configs.reduce(
      (prev, curr) => configMerger(curr, prev),
      // internal default tailwind config
      configMerger(moduleOptions.config, { content: { files: contentPaths } }),
    )) as TWConfig

    // Allow extending tailwindcss config by other modules
    configUpdatedHook['main-config'] = ''
    await nuxt.callHook('tailwindcss:config', new Proxy(tailwindConfig, trackObjChanges('main-config')))
    twCtx.set(tailwindConfig)

    return tailwindConfig
  }

  const generateConfig = () => enableHMR
    ? addTemplate({
      filename: CONFIG_TEMPLATE_NAME,
      write: true,
      getContents: () => {
        const serializeConfig = <T extends Partial<TWConfig>>(config: T) =>
          JSON.stringify(
            Array.isArray(config.plugins) && config.plugins.length > 0 ? configMerger({ plugins: (defaultPlugins: TWConfig['plugins']) => defaultPlugins?.filter(p => p && typeof p !== 'function') }, config) : config,
            (_, v) => typeof v === 'function' ? `() => (${JSON.stringify(v())})` : v,
          ).replace(/"(\(\) => \(.*\))"/g, (_, substr) => substr.replace(/\\"/g, '"'))

        const layerConfigs = configPaths.map((configPath) => {
          const configImport = `require(${JSON.stringify(/[/\\]node_modules[/\\]/.test(configPath) ? configPath : './' + relative(nuxt.options.buildDir, configPath))})`
          return configUpdatedHook[configPath] ? configUpdatedHook[configPath].startsWith('return {};') ? '' : `(() => {const cfg=configMerger(undefined, ${configImport});${configUpdatedHook[configPath]};return cfg;})()` : configImport
        }).filter(Boolean)

        return [
          `// generated by the @nuxtjs/tailwindcss <https://github.com/nuxt-modules/tailwindcss> module at ${(new Date()).toLocaleString()}`,
          `const configMerger = require(${JSON.stringify(createResolver(import.meta.url).resolve('./runtime/merger.js'))});`,
          `\nconst inlineConfig = ${serializeConfig(moduleOptions.config as Partial<TWConfig>)};\n`,
          'const config = [',
          layerConfigs.join(',\n'),
          `].reduce((prev, curr) => configMerger(curr, prev), configMerger(inlineConfig, { content: { files: ${JSON.stringify(contentPaths)} } }));\n`,
          `module.exports = ${configUpdatedHook['main-config'] ? `(() => {const cfg=config;${configUpdatedHook['main-config']};return cfg;})()` : 'config'}\n`,
        ].join('\n')
      },
    })
    : { dst: '' }

  const registerHooks = () => {
    if (!enableHMR) return

    nuxt.hook('app:templatesGenerated', async (_app, templates) => {
      if (Array.isArray(templates) && templates?.some(t => configPaths.includes(t.dst))) {
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
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        configFile && server.moduleGraph.invalidateModule(configFile)
      })
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
