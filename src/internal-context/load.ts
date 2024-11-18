import { addTemplate, createResolver, findPath, resolveAlias, updateTemplates, useNuxt } from '@nuxt/kit'
import { join, relative, resolve } from 'pathe'
import { loadConfig, type ResolvedConfig } from 'c12'
import _loadConfig from 'tailwindcss/loadConfig.js'
import type { ModuleOptions, TWConfig } from '../types'
import { resolveModulePaths } from '../resolvers'
import logger from '../logger'
import configMerger from '../runtime/merger.js'
import { twCtx } from './use'
import { checkUnsafeInlineConfig } from './validate'

const CONFIG_TEMPLATE_NAME = 'tailwind.config.cjs'

const JSONStringifyWithRegex = (obj: any) => JSON.stringify(obj, (_, v) => v instanceof RegExp ? `__REGEXP ${v.toString()}` : v)

const resolveConfigs = <T extends Partial<TWConfig> | string | undefined>(configs: T | T[], nuxtOptions = useNuxt().options) =>
  ((Array.isArray(configs) ? configs : [configs])
    .filter(Boolean)
    .map(async (config): Promise<ResolvedConfig | null> => {
      if (typeof config !== 'string') {
        return { config } as { config: NonNullable<T> }
      }

      const configFile = await (config.startsWith(nuxtOptions.buildDir) ? config : findPath(config, { extensions: ['.js', '.cjs', '.mjs', '.ts'] }))
      return configFile ? loadConfig({ configFile }) : null
    }))

const resolveContentPaths = (srcDir: string, nuxtOptions = useNuxt().options): ResolvedConfig => {
  const r = (p: string) => p.startsWith(srcDir) ? p : resolve(srcDir, p)
  const extensionFormat = (s: string[]) => s.length > 1 ? `.{${s.join(',')}}` : `.${s.join('') || 'vue'}`

  const defaultExtensions = extensionFormat(['js', 'ts', 'mjs'])
  const sfcExtensions = extensionFormat(Array.from(new Set(['.vue', ...nuxtOptions.extensions])).map(e => e.replace(/^\.*/, '')))

  const importDirs = [...(nuxtOptions.imports?.dirs || [])].map(r)
  const [composablesDir, utilsDir] = [resolve(srcDir, 'composables'), resolve(srcDir, 'utils')]

  if (!importDirs.includes(composablesDir)) importDirs.push(composablesDir)
  if (!importDirs.includes(utilsDir)) importDirs.push(utilsDir)

  return { config: { content: [
    r(`components/**/*${sfcExtensions}`),
    ...(() => {
      if (nuxtOptions.components) {
        return (Array.isArray(nuxtOptions.components) ? nuxtOptions.components : typeof nuxtOptions.components === 'boolean' ? ['components'] : nuxtOptions.components.dirs).map(d => `${resolveAlias(typeof d === 'string' ? d : d.path)}/**/*${sfcExtensions}`)
      }
      return []
    })(),

    nuxtOptions.dir.layouts && r(`${nuxtOptions.dir.layouts}/**/*${sfcExtensions}`),
    ...([true, undefined].includes(nuxtOptions.pages) ? [r(`${nuxtOptions.dir.pages}/**/*${sfcExtensions}`)] : []),

    nuxtOptions.dir.plugins && r(`${nuxtOptions.dir.plugins}/**/*${defaultExtensions}`),
    ...importDirs.map(d => `${d}/**/*${defaultExtensions}`),

    r(`{A,a}pp${sfcExtensions}`),
    r(`{E,e}rror${sfcExtensions}`),
    r(`app.config${defaultExtensions}`),
    !nuxtOptions.ssr && nuxtOptions.spaLoadingTemplate !== false && r(typeof nuxtOptions.spaLoadingTemplate === 'string' ? nuxtOptions.spaLoadingTemplate : 'app/spa-loading-template.html'),
  ].filter((p): p is string => Boolean(p)) } }
}

const createInternalContext = async (moduleOptions: ModuleOptions, nuxt = useNuxt()) => {
  const moduleConfigs = await Promise.all([
    resolveContentPaths(nuxt.options.srcDir, nuxt.options),
    ...resolveConfigs(moduleOptions.config, nuxt.options),
    loadConfig({ name: 'tailwind', cwd: nuxt.options.rootDir }),
    ...resolveConfigs(moduleOptions.configPath, nuxt.options),
    ...nuxt.options._layers.slice(1).flatMap(nuxtLayer => [
      resolveContentPaths(nuxtLayer.config?.srcDir || nuxtLayer.cwd, nuxt.options),
      ...resolveConfigs(nuxtLayer.config.tailwindcss?.config, nuxt.options),
      loadConfig({ name: 'tailwind', cwd: nuxtLayer.cwd }),
      ...resolveConfigs(nuxtLayer.config.tailwindcss?.configPath, nuxt.options),
    ]),
  ])

  const [configPaths, contentPaths] = await resolveModulePaths(moduleOptions.configPath, nuxt)
  const configUpdatedHook: Record<string, string> = {}
  const configResolvedPath = join(nuxt.options.buildDir, CONFIG_TEMPLATE_NAME)
  let enableHMR = true
  let unsafeInlineConfig: string | undefined = undefined

  if (moduleOptions.disableHMR) {
    enableHMR = false
  }

  for (const c of moduleConfigs) {
    if (c?.configFile) continue
    const hasUnsafeProperty = checkUnsafeInlineConfig(c?.config)

    if (hasUnsafeProperty) {
      unsafeInlineConfig = hasUnsafeProperty
      break
    }
  }

  if (unsafeInlineConfig && enableHMR) {
    logger.warn(
      `The provided Tailwind configuration in your \`nuxt.config\` is non-serializable. Check \`${unsafeInlineConfig}\`. Falling back to providing the loaded configuration inlined directly to PostCSS loader..`,
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

  const loadConfigs = async () => {
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
      {},
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
        await loadConfigs()
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
    loadConfigs,
    generateConfig,
    registerHooks,
  }
}

export { createInternalContext }
