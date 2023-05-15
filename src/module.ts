import { existsSync } from 'fs'
import { join, relative } from 'pathe'
import { watch } from 'chokidar'
import { underline, yellow } from 'colorette'

import {
  defineNuxtModule,
  installModule,
  addDevServerHandler,
  isNuxt2,
  useLogger,
  getNuxtVersion,
  createResolver,
  resolvePath,
  addVitePlugin,
  isNuxt3,
  addTemplate
} from '@nuxt/kit'

// @ts-expect-error
import defaultTailwindConfig from 'tailwindcss/stubs/config.simple.js'
import resolveConfig from 'tailwindcss/resolveConfig.js'
import { eventHandler, sendRedirect, H3Event } from 'h3'

import {
  configMerger,
  createTemplates,
  resolveConfigPath,
  resolveContentPaths,
  resolveInjectPosition
} from './utils'
import vitePlugin from './vite-hmr'
import { name, version, configKey, compatibility } from '../package.json'

import type { ModuleOptions, TWConfig } from './types'
export { ModuleOptions } from './types'

declare module '@nuxt/schema' {
  interface NuxtHooks {
    'tailwindcss:config': (tailwindConfig: Partial<TWConfig>) => void;
    'tailwindcss:loadConfig': (tailwindConfig: Partial<TWConfig> | undefined, configPath: string, index: number, configPaths: string[]) => void;
    'tailwindcss:resolvedConfig': (tailwindConfig: ReturnType<typeof resolveConfig<TWConfig>>) => void;
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: { name, version, configKey, compatibility },
  defaults: nuxt => ({
    configPath: 'tailwind.config',
    cssPath: join(nuxt.options.dir.assets, 'css/tailwind.css'),
    config: defaultTailwindConfig,
    viewer: true,
    exposeConfig: false,
    exposeLevel: 2,
    injectPosition: 'first',
    disableHmrHotfix: false
  }),
  async setup (moduleOptions, nuxt) {
    const logger = useLogger('nuxt:tailwindcss')
    const resolver = createResolver(import.meta.url)

    const [configPaths, contentPaths]: [Array<string>, Array<string>] =
      (nuxt.options._layers && nuxt.options._layers.length > 1)
        // Support `extends` directories
        ? (await Promise.all(
            // nuxt.options._layers is from rootDir to nested level
            // We need to reverse the order to give the deepest tailwind.config the lowest priority
            nuxt.options._layers.slice().reverse().map(async (layer) => ([
              await resolveConfigPath(layer?.config?.tailwindcss?.configPath || join(layer.cwd, 'tailwind.config')),
              resolveContentPaths(layer?.config?.srcDir || layer.cwd)
            ])))
          ).reduce((prev, curr) => prev.map((p, i) => p.concat(curr[i]))) as any
        : [await resolveConfigPath(moduleOptions.configPath), resolveContentPaths(nuxt.options.srcDir)]

    // Watch the Tailwind config file to restart the server
    if (nuxt.options.dev) {
      if (isNuxt2()) {
        nuxt.options.watch = nuxt.options.watch || []
        configPaths.forEach(path => nuxt.options.watch.push(path))
      } else if (Array.isArray(nuxt.options.watch)) {
        nuxt.options.watch.push(...configPaths.map(path => relative(nuxt.options.srcDir, path)))
      } else {
        const watcher = watch(configPaths, { depth: 0 }).on('change', (path) => {
          logger.info(`Tailwind config changed: ${path}`)
          logger.warn('Please restart the Nuxt server to apply changes or upgrade to latest Nuxt for automatic restart.')
        })
        nuxt.hook('close', () => watcher.close())
      }
    }

    const tailwindConfig = (
      await Promise.all(
        configPaths.map(async (configPath, idx, paths) => {
          let _tailwindConfig: Partial<TWConfig> | undefined
          try {
            _tailwindConfig = await import(configPath).then(c => c.default || c)
          } catch (e) {
            logger.warn(`Failed to load Tailwind config at: \`./${relative(nuxt.options.rootDir, configPath)}\``, e)
          }

          // Transform purge option from Array to object with { content }
          if (_tailwindConfig && !_tailwindConfig.content) {
            _tailwindConfig.content = _tailwindConfig.purge
          }

          await nuxt.callHook('tailwindcss:loadConfig', _tailwindConfig, configPath, idx, paths)
          return _tailwindConfig || {}
        }))
      ).reduce(
        (prev, curr) => configMerger(curr, prev),
        // internal default tailwind config
        configMerger(moduleOptions.config, { content: contentPaths })
      )

    // Allow extending tailwindcss config by other modules
    await nuxt.callHook('tailwindcss:config', tailwindConfig)

    const resolvedConfig = resolveConfig(tailwindConfig as TWConfig)
    await nuxt.callHook('tailwindcss:resolvedConfig', resolvedConfig)

    // Expose resolved tailwind config as an alias
    // https://tailwindcss.com/docs/configuration/#referencing-in-javascript
    if (moduleOptions.exposeConfig) {
      createTemplates(resolvedConfig, moduleOptions.exposeLevel, nuxt)
    }

    // Compute tailwindConfig hash
    tailwindConfig._hash = String(Date.now())

    /**
     * CSS file handling
     */

    const cssPath = typeof moduleOptions.cssPath === 'string' ? await resolvePath(moduleOptions.cssPath, { extensions: ['.css', '.sass', '.scss', '.less', '.styl'] }) : false

    // Include CSS file in project css
    let resolvedCss: string

    if (typeof cssPath === 'string') {
      if (existsSync(cssPath)) {
        logger.info(`Using Tailwind CSS from ~/${relative(nuxt.options.srcDir, cssPath)}`)
        resolvedCss = cssPath
      } else {
        logger.info('Using default Tailwind CSS file')
        resolvedCss = 'tailwindcss/tailwind.css'
      }
    } else {
      logger.info('No Tailwind CSS file found. Skipping...')
      resolvedCss = resolver.resolve(
        addTemplate({
          filename: 'tailwind-empty.css',
          write: true,
          getContents: () => ''
        }).dst
      )
    }
    nuxt.options.css = nuxt.options.css ?? []

    const resolvedNuxtCss = await Promise.all(nuxt.options.css.map((p: any) => resolvePath(p.src ?? p)))

    // Inject only if this file isn't listed already by user (e.g. user may put custom path both here and in css):
    if (!resolvedNuxtCss.includes(resolvedCss)) {
      let injectPosition: number
      try {
        injectPosition = resolveInjectPosition(nuxt.options.css, moduleOptions.injectPosition)
      } catch (e: any) {
        throw new Error('failed to resolve Tailwind CSS injection position: ' + e.message)
      }

      nuxt.options.css.splice(injectPosition, 0, resolvedCss)
    }

    /**
     * PostCSS 8 support for Nuxt 2
     */

    // Setup postcss plugins
    // https://tailwindcss.com/docs/using-with-preprocessors#future-css-features
    const postcssOptions =
      nuxt.options.postcss || /* nuxt 3 */ /* @ts-ignore */
      nuxt.options.build.postcss.postcssOptions || /* older nuxt3 */ /* @ts-ignore */
      nuxt.options.build.postcss as any
    postcssOptions.plugins = postcssOptions.plugins || {}
    postcssOptions.plugins['tailwindcss/nesting'] = postcssOptions.plugins['tailwindcss/nesting'] ?? {}
    postcssOptions.plugins['postcss-custom-properties'] = postcssOptions.plugins['postcss-custom-properties'] ?? {}
    postcssOptions.plugins.tailwindcss = tailwindConfig

    /*
    * install postcss8 module on nuxt < 2.16
    */
    const nuxtVersion = getNuxtVersion(nuxt).split('.')
    if (parseInt(nuxtVersion[0], 10) === 2 && parseInt(nuxtVersion[1], 10) < 16) {
      await installModule('@nuxt/postcss8')
    }

    /**
     * Vite HMR support
     */

    if (nuxt.options.dev && !moduleOptions.disableHmrHotfix) {
      // Insert Vite plugin to work around HMR issue
      addVitePlugin(vitePlugin(tailwindConfig, nuxt.options.rootDir, resolvedCss))
    }

    /**
     * Viewer
     */

    // Add _tailwind config viewer endpoint
    // TODO: Fix `addServerHandler` on Nuxt 2 w/o Bridge
    if (nuxt.options.dev && moduleOptions.viewer) {
      const { withTrailingSlash, withoutTrailingSlash, joinURL } = await import('ufo')
      const route = joinURL(nuxt.options.app?.baseURL, '/_tailwind')
      // @ts-ignore
      const createServer = await import('tailwind-config-viewer/server/index.js').then(r => r.default || r) as any
      const routerPrefix = isNuxt3() ? route : undefined
      const _viewerDevMiddleware = createServer({ tailwindConfigProvider: () => tailwindConfig, routerPrefix }).asMiddleware()
      const viewerDevMiddleware = eventHandler((event) => {
        if (event.req.url === withoutTrailingSlash(route)) {
          return sendRedirect(event, withTrailingSlash(event.req.url), 301)
        }
        _viewerDevMiddleware(event.req, event.res)
      })
      if (isNuxt3()) { addDevServerHandler({ route, handler: viewerDevMiddleware }) }
      // @ts-ignore
      if (isNuxt2()) { nuxt.options.serverMiddleware.push({ route, handler: (req, res) => viewerDevMiddleware(new H3Event(req, res)) }) }
      nuxt.hook('listen', (_, listener) => {
        const viewerUrl = `${withoutTrailingSlash(listener.url)}${route}`
        logger.info(`Tailwind Viewer: ${underline(yellow(withTrailingSlash(viewerUrl)))}`)
      })
    }

    if (nuxt.options.dev && moduleOptions.viewer) {
      nuxt.hook('devtools:customTabs', (tabs) => {
        tabs.push({
          title: 'TailwindCSS',
          name: 'tailwindcss',
          icon: 'logos-tailwindcss-icon',
          view: {
            type: 'iframe',
            src: '/_tailwind/'
          }
        })
      })
    }
  }

})
