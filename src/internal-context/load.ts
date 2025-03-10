import { addTemplate, findPath, resolveAlias, updateTemplates, useNuxt } from '@nuxt/kit'
import type { NuxtOptions, NuxtConfig, NuxtPage } from '@nuxt/schema'
import { join, relative, resolve, isAbsolute } from 'pathe'
import { getContext } from 'unctx'
import { loadConfig as loadConfigC12, type ResolvedConfig as ResolvedC12Config } from 'c12'
import type { ModuleOptions, TWConfig } from '../types'
import logger from '../logger'
import configMerger from '../merger'
import { twCtx } from './context'
import { checkUnsafeInlineConfig } from './validate'
import { createObjProxy } from './proxy'

const loadConfig = loadConfigC12<Partial<TWConfig>>
type ResolvedConfig = ResolvedC12Config<Partial<TWConfig>>

const pagesContentPath = getContext<string[]>('twcss-pages-path')
const resolvedConfigsCtx = getContext<Array<ResolvedConfig | null>>('twcss-resolved-configs')

const createInternalContext = async (moduleOptions: ModuleOptions, nuxt = useNuxt()) => {
  const configUpdatedHook: Record<string, string> = {}
  const { meta = { disableHMR: moduleOptions.disableHMR } } = twCtx.tryUse() ?? {}
  const trackObjChanges = createObjProxy(configUpdatedHook, meta)

  const resolveConfigs = <T extends Partial<TWConfig> | string | undefined>(configs: T | T[], nuxt = useNuxt()) =>
    ((Array.isArray(configs) ? configs : [configs])
      .filter(Boolean)
      .map(async (config, idx, arr): Promise<ResolvedConfig | null> => {
        if (typeof config !== 'string') {
          const hasUnsafeProperty = checkUnsafeInlineConfig(config)
          if (hasUnsafeProperty && !meta.disableHMR) {
            logger.warn(
              `The provided Tailwind configuration in your \`nuxt.config\` is non-serializable. Check \`${hasUnsafeProperty}\`. Falling back to providing the loaded configuration inlined directly to PostCSS loader..`,
              'Please consider using `tailwind.config` or a separate file (specifying in `configPath` of the module options) to enable it with additional support for IntelliSense and HMR. Suppress this warning with `quiet: true` in the module options.',
            )
            meta.disableHMR = true
            twCtx.set({ meta })
          }

          return { config } as { config: NonNullable<T> }
        }

        const configFile = await (config.startsWith(nuxt.options.buildDir) ? config : findPath(config, { extensions: ['.js', '.cjs', '.mjs', '.ts'] }))
        return configFile
          ? loadConfig({ configFile }).then(async (resolvedConfig) => {
              const { configFile: resolvedConfigFile = configFile } = resolvedConfig
              const config = configMerger(undefined, resolvedConfig.config)
              configUpdatedHook[resolvedConfigFile] = ''

              if (resolvedConfig.config?.purge && !resolvedConfig.config.content) {
                configUpdatedHook[resolvedConfigFile] += 'cfg.content = cfg.purge;'
              }

              await nuxt.callHook('tailwindcss:loadConfig', new Proxy(config, trackObjChanges(resolvedConfigFile)), resolvedConfigFile, idx, arr as any)
              return { ...resolvedConfig, config }
            }).catch((e) => {
              logger.warn(`Failed to load config \`./${relative(nuxt.options.rootDir, configFile)}\` due to the error below. Skipping..\n`, e)
              return null
            })
          : null
      }))

  const resolveContentConfig = (rootDir: string, nuxtOptions: NuxtOptions | NuxtConfig = useNuxt().options): ResolvedConfig => {
    const r = (p: string) => isAbsolute(p) || p.startsWith(rootDir) ? p : resolve(rootDir, p)
    const withSrcDir = (p: string) => r(nuxtOptions.srcDir && !p.startsWith(nuxtOptions.srcDir) ? resolve(nuxtOptions.srcDir, p) : p)
    // const withAppDir = (p: string) => r(nuxtOptions.appDir && !p.startsWith(nuxtOptions.appDir) ? resolve(nuxtOptions.appDir, p) : p)

    const formatExtensions = (s: string[]) => s.length > 1 ? `.{${s.join(',')}}` : `.${s.join('') || 'vue'}`
    const defaultExtensions = formatExtensions(['js', 'ts', 'mjs'])
    const sfcExtensions = formatExtensions(Array.from(new Set(['.vue', ...(nuxtOptions.extensions || nuxt.options.extensions)])).map(e => e?.replace(/^\.*/, '')).filter((v): v is string => Boolean(v)))

    const importDirs = [...(nuxtOptions.imports?.dirs || [])].filter((v): v is string => Boolean(v)).map(withSrcDir)
    const [composablesDir, utilsDir] = [withSrcDir('composables'), withSrcDir('utils')]

    if (!importDirs.includes(composablesDir)) importDirs.push(composablesDir)
    if (!importDirs.includes(utilsDir)) importDirs.push(utilsDir)

    const isLayer = rootDir !== nuxt.options.rootDir
    const rootProjectFiles: string[] = []

    if (!isLayer) {
      const pageFiles = pagesContentPath.tryUse()

      if (pageFiles && pageFiles.length) {
        rootProjectFiles.push(...pageFiles)
      }
      // @ts-expect-error pages can be an object
      else if (nuxtOptions.pages !== false && nuxtOptions.pages?.enabled !== false) {
        rootProjectFiles.push(withSrcDir(`${nuxtOptions.dir?.pages || 'pages'}/**/*${sfcExtensions}`))
      }
    }

    return {
      config: {
        content: {
          files: [
            withSrcDir(`components/**/*${sfcExtensions}`),
            ...(() => {
              if (nuxtOptions.components) {
                return (Array.isArray(nuxtOptions.components) ? nuxtOptions.components : typeof nuxtOptions.components === 'boolean' ? ['components'] : (nuxtOptions.components.dirs || [])).map((d) => {
                  const valueToResolve = typeof d === 'string' ? d : d?.path
                  return valueToResolve ? `${resolveAlias(valueToResolve)}/**/*${sfcExtensions}` : ''
                }).filter(Boolean)
              }
              return []
            })(),

            nuxtOptions.dir?.layouts && withSrcDir(`${nuxtOptions.dir.layouts}/**/*${sfcExtensions}`),
            nuxtOptions.dir?.plugins && withSrcDir(`${nuxtOptions.dir.plugins}/**/*${defaultExtensions}`),
            ...importDirs.map(d => `${d}/**/*${defaultExtensions}`),
            ...rootProjectFiles,

            withSrcDir(`{A,a}pp${sfcExtensions}`),
            withSrcDir(`{E,e}rror${sfcExtensions}`),
            withSrcDir(`app.config${defaultExtensions}`),
            !nuxtOptions.ssr && nuxtOptions.spaLoadingTemplate !== false && withSrcDir(typeof nuxtOptions.spaLoadingTemplate === 'string' ? nuxtOptions.spaLoadingTemplate : 'app/spa-loading-template.html'),
          ].filter((p): p is string => Boolean(p)),
        },
      },
    }
  }

  const resolvePageFiles = (pages: NuxtPage[]) => {
    const filePaths: string[] = []

    pages.forEach((page) => {
      if (page.file) {
        filePaths.push(page.file)
      }

      if (page.children && page.children.length) {
        filePaths.push(...resolvePageFiles(page.children))
      }
    })

    return filePaths
  }

  const getModuleConfigs = () => {
    const thenCallHook = async (resolvedConfig: ResolvedConfig) => {
      const { configFile: resolvedConfigFile } = resolvedConfig
      if (!resolvedConfigFile || !resolvedConfig.config) {
        return { ...resolvedConfig, configFile: resolvedConfigFile === 'tailwind.config' ? undefined : resolvedConfigFile }
      }

      const config = configMerger(undefined, resolvedConfig.config)
      configUpdatedHook[resolvedConfigFile] = ''

      if (resolvedConfig.config?.purge && !resolvedConfig.config.content) {
        configUpdatedHook[resolvedConfigFile] += 'cfg.content = cfg.purge;'
      }

      await nuxt.callHook('tailwindcss:loadConfig', new Proxy(config, trackObjChanges(resolvedConfigFile)), resolvedConfigFile, 0, [])
      return { ...resolvedConfig, config }
    }

    return Promise.all([
      resolveContentConfig(nuxt.options.rootDir, nuxt.options),
      ...resolveConfigs(moduleOptions.config, nuxt),
      loadConfig({ name: 'tailwind', cwd: nuxt.options.rootDir, merger: configMerger, packageJson: true, extend: false }).then(thenCallHook),
      ...resolveConfigs(moduleOptions.configPath, nuxt),

      ...(nuxt.options._layers || []).slice(1).flatMap(nuxtLayer => [
        resolveContentConfig(nuxtLayer.config.rootDir || nuxtLayer.cwd, nuxtLayer.config),
        ...resolveConfigs(nuxtLayer.config.tailwindcss?.config, nuxt),
        loadConfig({ name: 'tailwind', cwd: nuxtLayer.cwd, merger: configMerger, packageJson: true, extend: false }).then(thenCallHook),
        ...resolveConfigs(nuxtLayer.config.tailwindcss?.configPath, nuxt),
      ]),
    ])
  }

  const resolveTWConfig = await import('tailwindcss/resolveConfig.js').then(m => m.default || m).catch(() => (c: unknown) => c) as <T extends Partial<TWConfig>>(config: T) => T

  const loadConfigs = async () => {
    const moduleConfigs = await getModuleConfigs()
    resolvedConfigsCtx.set(moduleConfigs, true)
    const tailwindConfig = moduleConfigs.reduce((acc, curr) => configMerger(acc, curr?.config ?? {}), {} as Partial<TWConfig>)

    // Allow extending tailwindcss config by other modules
    configUpdatedHook['main-config'] = ''
    await nuxt.callHook('tailwindcss:config', new Proxy(tailwindConfig, trackObjChanges('main-config')))

    const resolvedConfig = resolveTWConfig(tailwindConfig)
    await nuxt.callHook('tailwindcss:resolvedConfig', resolvedConfig as any, twCtx.tryUse()?.config as any ?? undefined)
    twCtx.set({ config: resolvedConfig })

    return tailwindConfig
  }

  const generateConfig = () => {
    const ctx = twCtx.tryUse()
    const targetDir = join(nuxt.options.buildDir, 'tailwind')

    const template = !meta.disableHMR || !ctx?.meta?.disableHMR
      ? addTemplate({
          filename: 'tailwind/postcss.mjs',
          write: true,
          getContents: () => {
            const serializeConfig = <T extends Partial<TWConfig>>(config: T) =>
              JSON.stringify(
                Array.isArray(config.plugins) && config.plugins.length > 0 ? configMerger({ plugins: (defaultPlugins: TWConfig['plugins']) => defaultPlugins?.filter(p => p && typeof p !== 'function') }, config) : config,
                (_, v) => typeof v === 'function' ? `() => (${JSON.stringify(v())})` : v,
              ).replace(/"(\(\) => \(.*\))"/g, (_, substr) => substr.replace(/\\"/g, '"'))

            const layerConfigs = resolvedConfigsCtx.use().map((c, idx): [string | null, string | null] => c?.configFile ? [`import cfg${idx} from ${JSON.stringify(/[/\\]node_modules[/\\]/.test(c.configFile) ? c.configFile : './' + relative(targetDir, c.configFile))}`, configUpdatedHook[c.configFile] ? `(() => {const cfg=configMerger(undefined, cfg${idx});${configUpdatedHook[c.configFile]};return cfg;})()` : `cfg${idx}`] : [null, c?.config ? serializeConfig(c.config) : null])

            return [
              `// generated by the @nuxtjs/tailwindcss <https://github.com/nuxt-modules/tailwindcss> module at ${(new Date()).toLocaleString()}`,
              `import configMerger from "@nuxtjs/tailwindcss/merger";\n`,
              layerConfigs.map(([i, _]) => i).filter(Boolean).join(';\n') + ';',
              'const config = [',
              layerConfigs.map(([_, i]) => i).filter(Boolean).join(',\n'),
              `].reduce((acc, curr) => configMerger(acc, curr), {});\n`,
              `const resolvedConfig = ${configUpdatedHook['main-config'] ? `(() => {const cfg=config;${configUpdatedHook['main-config']};return cfg;})()` : 'config'};\n`,
              'export default resolvedConfig;',
            ].join('\n')
          },
        })
      : { dst: '' }

    twCtx.set({ dst: template.dst })
    return template
  }

  const registerHooks = () => {
    if (twCtx.use().meta?.disableHMR) return

    const reloadConfigTemplate = async () => {
      const { dst } = twCtx.use()
      await loadConfigs()

      setTimeout(async () => {
        await updateTemplates({ filter: t => t.dst === dst || dst?.endsWith(t.filename) || false })
        await nuxt.callHook('tailwindcss:internal:regenerateTemplates', { configTemplateUpdated: true })
      }, 100)
    }

    nuxt.hook('app:templatesGenerated', async (_app, templates) => {
      if (Array.isArray(templates) && templates?.some(t => Object.keys(configUpdatedHook).includes(t.dst))) {
        await reloadConfigTemplate()
      }
    })

    nuxt.hook('pages:extend', async (pages) => {
      const newPageFiles = resolvePageFiles(pages)

      if (newPageFiles.length !== pagesContentPath.tryUse()?.length) {
        pagesContentPath.set(newPageFiles, true)
        await reloadConfigTemplate()
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
        setTimeout(async () => {
          await import(ctx.dst!).then(async (_config) => {
            twCtx.set({ config: resolveTWConfig(_config) })
            await nuxt.callHook('tailwindcss:internal:regenerateTemplates')
          })
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
