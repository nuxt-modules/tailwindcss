import { existsSync } from 'fs'
import { join, relative } from 'pathe'
import { defuArrayFn } from 'defu'
import { watch } from 'chokidar'
import { underline, yellow } from 'colorette'
import {
  defineNuxtModule,
  installModule,
  addTemplate,
  addDevServerHandler,
  isNuxt2,
  useLogger,
  getNuxtVersion,
  createResolver,
  resolvePath,
  addVitePlugin,
  isNuxt3, findPath, requireModule
} from '@nuxt/kit'
import type { Config } from 'tailwindcss'
// @ts-expect-error
import defaultTailwindConfig from 'tailwindcss/stubs/config.simple.js'
import { eventHandler, sendRedirect } from 'h3'
import { name, version } from '../package.json'
import vitePlugin from './hmr'
import { createTemplates, InjectPosition, resolveInjectPosition } from './utils'

const logger = useLogger('nuxt:tailwindcss')

const layerPaths = (srcDir: string) => ([
  `${srcDir}/components/**/*.{vue,js,ts}`,
  `${srcDir}/layouts/**/*.vue`,
  `${srcDir}/pages/**/*.vue`,
  `${srcDir}/composables/**/*.{js,ts}`,
  `${srcDir}/plugins/**/*.{js,ts}`,
  `${srcDir}/utils/**/*.{js,ts}`,
  `${srcDir}/App.{js,ts,vue}`,
  `${srcDir}/app.{js,ts,vue}`,
  `${srcDir}/Error.{js,ts,vue}`,
  `${srcDir}/error.{js,ts,vue}`
])

type Arrayable<T> = T | T[]

declare module '@nuxt/schema' {
  interface NuxtHooks {
    'tailwindcss:config': (tailwindConfig: Config) => void
  }
}

interface ExtendTailwindConfig {
  content: Config['content'] | ((contentDefaults: string[]) => Config['content']);
}

export interface ModuleOptions {
  configPath: Arrayable<string>;
  cssPath: string | false;
  config: Omit<Config, keyof ExtendTailwindConfig> & ExtendTailwindConfig;
  viewer: boolean;
  exposeConfig: boolean;
  exposeLevel: number;
  injectPosition: InjectPosition;
  disableHmrHotfix: boolean;
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'tailwindcss'
  },
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
    /**
     * Config file handling
     */

    const configPaths: string[] = []
    const contentPaths = []

    /**
     * Push config paths into `configPaths` without extension.
     * Allows next steps of processing to try both .js / .ts when resolving the config.
     */
    const addConfigPath = async (path: Arrayable<string>) => {
      // filter in case an empty path is provided
      const paths = (Array.isArray(path) ? path : [path]).filter(Boolean)
      for (const path of paths) {
        const resolvedPath = (await findPath(path, { extensions: ['.js', '.cjs', '.mjs', '.ts'] }, 'file'))
        // only if the path is found
        if (resolvedPath) {
          configPaths.push(resolvedPath)
        }
      }
    }

    // Support `extends` directories
    if (nuxt.options._layers && nuxt.options._layers.length > 1) {
      // nuxt.options._layers is from rootDir to nested level
      // We need to reverse the order to give the deepest tailwind.config the lowest priority
      const layers = nuxt.options._layers.slice().reverse()
      for (const layer of layers) {
        await addConfigPath(layer?.config?.tailwindcss?.configPath || join(layer.cwd, 'tailwind.config'))
        contentPaths.push(...layerPaths(layer.cwd))
      }
    } else {
      await addConfigPath(moduleOptions.configPath)
      contentPaths.push(...layerPaths(nuxt.options.srcDir))
    }

    // Watch the Tailwind config file to restart the server
    if (nuxt.options.dev) {
      if (isNuxt2()) {
        // @ts-ignore
        nuxt.options.watch = nuxt.options.watch || []
        // @ts-ignore
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

    // Default tailwind config
    let tailwindConfig = defuArrayFn(moduleOptions.config, { content: contentPaths }) as Config
    // Recursively resolve each config and merge tailwind configs together.
    for (const configPath of configPaths) {
      let _tailwindConfig: Config | undefined
      try {
        _tailwindConfig = requireModule(configPath, { clearCache: true })
      } catch (e) {
        logger.warn(`Failed to load Tailwind config at: \`./${relative(nuxt.options.rootDir, configPath)}\``, e)
      }

      // Transform purge option from Array to object with { content }
      if (_tailwindConfig && Array.isArray(_tailwindConfig.purge) && !_tailwindConfig.content) {
        _tailwindConfig.content = _tailwindConfig.purge
      }
      if (_tailwindConfig) {
        tailwindConfig = defuArrayFn(_tailwindConfig, tailwindConfig)
      }
    }

    // Allow extending tailwindcss config by other modules
    await nuxt.callHook('tailwindcss:config', tailwindConfig)

    // Write cjs version of config to support vscode extension
    const resolveConfig = await import('tailwindcss/resolveConfig.js').then(r => r.default || r)
    const resolvedConfig = resolveConfig(tailwindConfig) as Config
    // Avoid creating null plugins for intelisense
    resolvedConfig.plugins = []
    resolvedConfig.presets = (resolvedConfig.presets || []).map(
      preset => preset?.plugins ? { ...preset, plugins: [] } : preset
    )
    addTemplate({
      filename: 'tailwind.config.cjs',
      getContents: () => `module.exports = ${JSON.stringify(resolvedConfig, null, 2)}`,
      write: true
    })

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
        logger.info('Using default Tailwind CSS file from runtime/tailwind.css')
        // @ts-ignore
        resolvedCss = createResolver(import.meta.url).resolve('runtime/tailwind.css')
      }
    } else {
      logger.info('No Tailwind CSS file found. Skipping...')
      resolvedCss = createResolver(import.meta.url).resolve('runtime/empty.css')
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
      if (isNuxt2()) { nuxt.options.serverMiddleware.push({ route, handler: viewerDevMiddleware }) }
      nuxt.hook('listen', (_, listener) => {
        const viewerUrl = `${withoutTrailingSlash(listener.url)}${route}`
        logger.info(`Tailwind Viewer: ${underline(yellow(withTrailingSlash(viewerUrl)))}`)
      })
    }

    if (nuxt.options.dev && moduleOptions.viewer) {
      // @ts-expect-error missing type
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
