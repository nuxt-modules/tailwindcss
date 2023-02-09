import { existsSync } from 'fs'
import { join, relative } from 'pathe'
import { defuArrayFn } from 'defu'
import { watch } from 'chokidar'
import chalk from 'chalk'
import consola from 'consola'
import {
  defineNuxtModule,
  installModule,
  addTemplate,
  addDevServerHandler,
  isNuxt2,
  getNuxtVersion,
  createResolver,
  resolvePath,
  addVitePlugin,
  isNuxt3, findPath, requireModule
} from '@nuxt/kit'
import { Config } from 'tailwindcss'
import { eventHandler, sendRedirect } from 'h3'
import { name, version } from '../package.json'
import vitePlugin from './hmr'
import defaultTailwindConfig from './tailwind.config'
import { InjectPosition, resolveInjectPosition } from './utils'

const logger = consola.withScope('nuxt:tailwindcss')

const layerPaths = (srcDir: string) => ([
  `${srcDir}/components/**/*.{vue,js,ts}`,
  `${srcDir}/layouts/**/*.vue`,
  `${srcDir}/pages/**/*.vue`,
  `${srcDir}/composables/**/*.{js,ts}`,
  `${srcDir}/plugins/**/*.{js,ts}`,
  `${srcDir}/App.{js,ts,vue}`,
  `${srcDir}/app.{js,ts,vue}`,
  `${srcDir}/Error.{js,ts,vue}`,
  `${srcDir}/error.{js,ts,vue}`
])

export interface ModuleHooks {
  'tailwindcss:config': (tailwindConfig: any) => void
}

type Arrayable<T> = T | T[]

export interface ModuleOptions {
  configPath: Arrayable<string>;
  cssPath: string | false;
  config: Config;
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
    config: defaultTailwindConfig(),
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
      interface NuxtLayer {
        config: any
        configFile: string
        cwd: string
      }

      // nuxt.options._layers is from rootDir to nested level
      // We need to reverse the order to give the deepest tailwind.config the lowest priority
      const layers = (nuxt.options._layers as NuxtLayer[]).slice().reverse()
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
      } else {
        watch(configPaths).on('change', (path) => {
          logger.info(`Tailwind config changed: ${path}`)
          logger.warn('Please restart the Nuxt server to apply changes')
        })
      }
    }

    // Default tailwind config
    let tailwindConfig: any = defuArrayFn(moduleOptions.config, { content: contentPaths })
    // Recursively resolve each config and merge tailwind configs together.
    for (const configPath of configPaths) {
      let _tailwindConfig
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

    // Write cjs version of config to support vscode extension
    const resolveConfig: any = await import('tailwindcss/resolveConfig.js').then(r => r.default || r)
    const resolvedConfig = resolveConfig(tailwindConfig)
    // Avoid creating null plugins for intelisense
    resolvedConfig.plugins = []
    addTemplate({
      filename: 'tailwind.config.cjs',
      getContents: () => `module.exports = ${JSON.stringify(resolvedConfig, null, 2)}`,
      write: true
    })

    // Expose resolved tailwind config as an alias
    // https://tailwindcss.com/docs/configuration/#referencing-in-javascript
    if (moduleOptions.exposeConfig) {
      /**
       * Creates MJS exports for properties of the config
       *
       * @param obj config
       * @param path parent properties trace
       * @param level level of object depth
       * @param maxLevel maximum level of depth
       */
      const populateMap = (obj: any, path: string[] = [], level = 1, maxLevel = moduleOptions.exposeLevel) => {
        Object.entries(obj).forEach(([key, value = {}]) => {
          if (
            level >= maxLevel || // if recursive call is more than desired
            typeof value !== 'object' || // if its not an object, no more recursion required
            Array.isArray(value) || // arrays are objects in JS, but we can't break it down
            Object.keys(value as any).find(k => !k.match(/^[0-9a-z]+$/i)) // object has non-alphanumeric property (unsafe var name)
          ) {
            addTemplate({
              filename: `tailwind.config/${path.concat(key).join('/')}.mjs`,
              getContents: () => `export default ${JSON.stringify(value, null, 2)}`
            })
          } else {
            // recurse through nested objects
            populateMap(value, path.concat(key), level + 1, maxLevel)

            const values = Object.keys(value as any)
            addTemplate({
              filename: `tailwind.config/${path.concat(key).join('/')}.mjs`,
              getContents: () => `${Object.keys(value as any).map(v => `import _${v} from "./${key}/${v}.mjs"`).join('\n')}\nconst config = { ${values.map(k => `"${k}": _${k}`).join(', ')} }\nexport { config as default${values.length > 0 ? ', _' : ''}${values.join(', _')} }`
            })
          }
        })
      }

      populateMap(resolvedConfig)

      const configOptions = Object.keys(resolvedConfig)
      const template = addTemplate({
        filename: 'tailwind.config.mjs',
        getContents: () => `${configOptions.map(v => `import ${v} from "./tailwind.config/${v}.mjs"`).join('\n')}\nconst config = { ${configOptions.join(', ')} }\nexport { config as default, ${configOptions.join(', ')} }`
      })
      addTemplate({
        filename: 'tailwind.config.d.ts',
        getContents: () => `type tailwindcssConfig = import("tailwindcss").Config\ndeclare const config: tailwindcssConfig\n${configOptions.map(o => `declare const ${o}: tailwindcssConfig["${o}"]`).join('\n')}\nexport { config as default, ${configOptions.join(', ')} }`,
        write: true
      })
      nuxt.options.alias['#tailwind-config'] = template.dst
    }

    // Allow extending tailwindcss config by other modules
    // @ts-ignore
    await nuxt.callHook('tailwindcss:config', tailwindConfig)

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
    const nuxtVersion = getNuxtVersion(nuxt).split('.');
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
      const route = '/_tailwind'
      // @ts-ignore
      const createServer = await import('tailwind-config-viewer/server/index.js').then(r => r.default || r) as any
      const { withTrailingSlash, withoutTrailingSlash } = await import('ufo')
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
        logger.info(`Tailwind Viewer: ${chalk.underline.yellow(withTrailingSlash(viewerUrl))}`)
      })
    }
  }
})
