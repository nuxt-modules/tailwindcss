import { addTemplate, createResolver, findPath, resolveAlias, updateTemplates, useNuxt } from '@nuxt/kit'
import type { NuxtOptions, NuxtConfig } from '@nuxt/schema'
import { join, relative, resolve } from 'pathe'
import { loadConfig as loadConfigC12, type ResolvedConfig as ResolvedC12Config } from 'c12'
import type { ModuleOptions, TWConfig } from '../types'
import logger from '../logger'
import configMerger from '../runtime/merger.js'
import { twCtx } from './context'
import { checkUnsafeInlineConfig } from './validate'
import { createObjProxy } from './proxy'

const loadConfig = loadConfigC12<Partial<TWConfig>>
type ResolvedConfig = ResolvedC12Config<Partial<TWConfig>>

const resolveConfigs = <T extends Partial<TWConfig> | string | undefined>(configs: T | T[], nuxt = useNuxt()) =>
  ((Array.isArray(configs) ? configs : [configs])
    .filter(Boolean)
    .map(async (config): Promise<ResolvedConfig | null> => {
      if (typeof config !== 'string') {
        return { config } as { config: NonNullable<T> }
      }

      const configFile = await (config.startsWith(nuxt.options.buildDir) ? config : findPath(config, { extensions: ['.js', '.cjs', '.mjs', '.ts'] }))
      return configFile
        ? loadConfig({ configFile }).catch((e) => {
          logger.warn(`Error occurred while loading \`${configFile}\`:`, e)
          return null
        })
        : null
    }))

const resolveContentConfig = (srcDir: string, nuxtOptions: NuxtOptions | NuxtConfig = useNuxt().options): ResolvedConfig => {
  const r = (p: string) => p.startsWith(srcDir) ? p : resolve(srcDir, p)
  const extensionFormat = (s: string[]) => s.length > 1 ? `.{${s.join(',')}}` : `.${s.join('') || 'vue'}`

  const defaultExtensions = extensionFormat(['js', 'ts', 'mjs'])
  const sfcExtensions = extensionFormat(Array.from(new Set(['.vue', ...(nuxtOptions.extensions || [])])).map(e => e?.replace(/^\.*/, '')).filter((v): v is string => Boolean(v)))

  const importDirs = [...(nuxtOptions.imports?.dirs || [])].filter((v): v is string => Boolean(v)).map(r)
  const [composablesDir, utilsDir] = [resolve(srcDir, 'composables'), resolve(srcDir, 'utils')]

  if (!importDirs.includes(composablesDir)) importDirs.push(composablesDir)
  if (!importDirs.includes(utilsDir)) importDirs.push(utilsDir)

  return {
    config: {
      content: [
        r(`components/**/*${sfcExtensions}`),
        ...(() => {
          if (nuxtOptions.components) {
            return (Array.isArray(nuxtOptions.components) ? nuxtOptions.components : typeof nuxtOptions.components === 'boolean' ? ['components'] : (nuxtOptions.components.dirs || [])).map((d) => {
              const valueToResolve = typeof d === 'string' ? d : d?.path
              return valueToResolve ? `${resolveAlias(valueToResolve)}/**/*${sfcExtensions}` : ''
            }).filter(Boolean)
          }
          return []
        })(),

        nuxtOptions.dir?.layouts && r(`${nuxtOptions.dir.layouts}/**/*${sfcExtensions}`),
        ...([true, undefined].includes(nuxtOptions.pages) && nuxtOptions.dir?.pages ? [r(`${nuxtOptions.dir.pages}/**/*${sfcExtensions}`)] : []),

        nuxtOptions.dir?.plugins && r(`${nuxtOptions.dir.plugins}/**/*${defaultExtensions}`),
        ...importDirs.map(d => `${d}/**/*${defaultExtensions}`),

        r(`{A,a}pp${sfcExtensions}`),
        r(`{E,e}rror${sfcExtensions}`),
        r(`app.config${defaultExtensions}`),
        !nuxtOptions.ssr && nuxtOptions.spaLoadingTemplate !== false && r(typeof nuxtOptions.spaLoadingTemplate === 'string' ? nuxtOptions.spaLoadingTemplate : 'app/spa-loading-template.html'),
      ].filter((p): p is string => Boolean(p)),
    },
  }
}

const createInternalContext = async (moduleOptions: ModuleOptions, nuxt = useNuxt()) => {
  const getModuleConfigs = () => Promise.all([
    resolveContentConfig(nuxt.options.srcDir, nuxt.options),
    ...resolveConfigs(moduleOptions.config, nuxt),
    loadConfig({ name: 'tailwind', cwd: nuxt.options.rootDir }),
    ...resolveConfigs(moduleOptions.configPath, nuxt),

    ...nuxt.options._layers.slice(1).flatMap(nuxtLayer => [
      resolveContentConfig(nuxtLayer.config?.srcDir || nuxtLayer.cwd, nuxtLayer.config),
      ...resolveConfigs(nuxtLayer.config.tailwindcss?.config, nuxt),
      loadConfig({ name: 'tailwind', cwd: nuxtLayer.cwd }),
      ...resolveConfigs(nuxtLayer.config.tailwindcss?.configPath, nuxt),
    ]),
  ])

  const configUpdatedHook: Record<string, string> = {}
  const trackObjChanges = createObjProxy(configUpdatedHook)

  const resolveTWConfig = await import('tailwindcss/resolveConfig').then(m => m.default || m).catch(() => (c: unknown) => c) as <T extends Partial<TWConfig>>(config: T) => T

  const loadConfigs = async () => {
    const { meta = { disableHMR: moduleOptions.disableHMR } } = twCtx.tryUse() ?? {}

    const moduleConfigs = await getModuleConfigs()
    moduleConfigs.forEach((c) => {
      if (c?.configFile) {
        configUpdatedHook[c.configFile] = ''
      }
      else {
        const hasUnsafeProperty = checkUnsafeInlineConfig(c?.config)

        if (hasUnsafeProperty && !meta.disableHMR) {
          logger.warn(
            `The provided Tailwind configuration in your \`nuxt.config\` is non-serializable. Check \`${hasUnsafeProperty}\`. Falling back to providing the loaded configuration inlined directly to PostCSS loader..`,
            'Please consider using `tailwind.config` or a separate file (specifying in `configPath` of the module options) to enable it with additional support for IntelliSense and HMR. Suppress this warning with `quiet: true` in the module options.',
          )
          meta.disableHMR = true
        }
      }
    })

    const tailwindConfig = await Promise.all((
      moduleConfigs.map(async (c, idx) => {
        const _tailwindConfig = ((): Partial<TWConfig> | undefined => {
          try {
            return configMerger(undefined, c?.config)
          }
          catch (e) {
            const error = e instanceof Error ? ('code' in e ? e.code as string : e.name).toUpperCase() : typeof e === 'string' ? e.toUpperCase() : ''

            if (c?.configFile?.startsWith(nuxt.options.buildDir) && ['MODULE_NOT_FOUND'].includes(error)) {
              configUpdatedHook[c.configFile] = nuxt.options.dev ? 'return {};' : ''
              return
            }

            if (c?.configFile) {
              configUpdatedHook[c.configFile] = 'return {};'
              logger.warn(`Failed to load config \`./${relative(nuxt.options.rootDir, c.configFile)}\` due to the error below. Skipping..\n`, e)
            }
          }
        })()

        // Transform purge option from Array to object with { content }
        if (c?.configFile && _tailwindConfig?.purge && !_tailwindConfig.content) {
          configUpdatedHook[c.configFile] += 'cfg.content = cfg.purge;'
        }

        if (c?.configFile)
          await nuxt.callHook('tailwindcss:loadConfig', _tailwindConfig && new Proxy(_tailwindConfig, trackObjChanges(c.configFile)), c.configFile, idx, [])

        return _tailwindConfig || {}
      })),
    ).then(configs => configs.reduce((prev, curr) => configMerger(prev, curr), {})) as TWConfig

    // Allow extending tailwindcss config by other modules
    configUpdatedHook['main-config'] = ''
    await nuxt.callHook('tailwindcss:config', new Proxy(tailwindConfig, trackObjChanges('main-config')))

    const resolvedConfig = resolveTWConfig(tailwindConfig)
    await nuxt.callHook('tailwindcss:resolvedConfig', resolvedConfig as any, twCtx.tryUse()?.config as any ?? undefined)
    twCtx.set({ config: resolvedConfig, meta })

    return tailwindConfig
  }

  const generateConfig = () => {
    const ctx = twCtx.tryUse()

    const template = !ctx?.meta?.disableHMR
      ? addTemplate({
        filename: 'tailwind.config.cjs',
        write: true,
        getContents: async () => {
          const moduleConfigs = await getModuleConfigs()
          const serializeConfig = <T extends Partial<TWConfig>>(config: T) =>
            JSON.stringify(
              Array.isArray(config.plugins) && config.plugins.length > 0 ? configMerger({ plugins: (defaultPlugins: TWConfig['plugins']) => defaultPlugins?.filter(p => p && typeof p !== 'function') }, config) : config,
              (_, v) => typeof v === 'function' ? `() => (${JSON.stringify(v())})` : v,
            ).replace(/"(\(\) => \(.*\))"/g, (_, substr) => substr.replace(/\\"/g, '"'))

          const layerConfigs = moduleConfigs.map((c) => {
            if (c?.configFile) {
              const configImport = `require(${JSON.stringify(/[/\\]node_modules[/\\]/.test(c.configFile) ? c.configFile : './' + relative(nuxt.options.buildDir, c.configFile))})`
              return configUpdatedHook[c.configFile] ? configUpdatedHook[c.configFile].startsWith('return {};') ? '' : `(() => {const cfg=configMerger(undefined, ${configImport});${configUpdatedHook[c.configFile]};return cfg;})()` : configImport
            }

            return c && serializeConfig(c.config)
          }).filter(Boolean)

          return [
            `// generated by the @nuxtjs/tailwindcss <https://github.com/nuxt-modules/tailwindcss> module at ${(new Date()).toLocaleString()}`,
            `const configMerger = require(${JSON.stringify(createResolver(import.meta.url).resolve('../runtime/merger.js'))});`,
            'const config = [',
            layerConfigs.join(',\n'),
            `].reduce((prev, curr) => configMerger(prev, curr), {});\n`,
            `module.exports = ${configUpdatedHook['main-config'] ? `(() => {const cfg=config;${configUpdatedHook['main-config']};return cfg;})()` : 'config'}\n`,
          ].join('\n')
        },
      })
      : { dst: '' }

    return template
  }

  const registerHooks = () => {
    if (twCtx.use().meta?.disableHMR) return

    nuxt.hook('app:templatesGenerated', async (_app, templates) => {
      if (Array.isArray(templates) && templates?.some(t => Object.keys(configUpdatedHook).includes(t.dst))) {
        const { dst } = twCtx.use()
        await loadConfigs()

        setTimeout(async () => {
          await updateTemplates({ filter: t => t.dst === dst || dst?.endsWith(t.filename) || false })
          await nuxt.callHook('tailwindcss:internal:regenerateTemplates', { configTemplateUpdated: true })
        }, 100)
      }
    })

    nuxt.hook('vite:serverCreated', (server) => {
      nuxt.hook('tailwindcss:internal:regenerateTemplates', (data) => {
        if (!data || !data.configTemplateUpdated) return
        const ctx = twCtx.use()
        const configFile = ctx.dst && server.moduleGraph.getModuleById(ctx.dst)
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        configFile && server.moduleGraph.invalidateModule(configFile)
      })
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    moduleOptions.exposeConfig && nuxt.hook('builder:watch', async (_, path) => {
      if (Object.keys(configUpdatedHook).includes(join(nuxt.options.rootDir, path))) {
        const ctx = twCtx.use()
        await loadConfig({ configFile: ctx.dst }).then(({ config }) => twCtx.set({ config }))

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
