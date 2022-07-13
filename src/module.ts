import { existsSync } from 'fs'
import { join, relative } from 'pathe'
import defu, { defuArrayFn } from 'defu'
import chalk from 'chalk'
import consola from 'consola'
import {
  defineNuxtModule,
  installModule,
  addTemplate,
  addDevServerHandler,
  isNuxt2,
  createResolver,
  resolvePath,
  addVitePlugin,
  tryRequireModule
} from '@nuxt/kit'
import { name, version } from '../package.json'
import vitePlugin from './hmr'
import defaultTailwindConfig from './tailwind.config'

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

export default defineNuxtModule({
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
    injectPosition: 0,
    disableHmrHotfix: false
  }),
  async setup (moduleOptions, nuxt) {
    /**
     * Config file handling
     */

    const configPaths = []
    const contentPaths = []

    const addConfigPath = async (path: string | string[]) => {
      if (typeof path === 'string') {
        configPaths.push(await resolvePath(path))
      }
      if (Array.isArray(path)) {
        for (const _path of path) {
          configPaths.push(await resolvePath(_path))
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

      for (const layer of (nuxt.options._layers as NuxtLayer[])) {
        await addConfigPath(layer?.config?.tailwindcss?.configPath || join(layer.cwd, 'tailwind.config'))
        contentPaths.push(...layerPaths(layer.cwd))
      }
    } else {
      await addConfigPath(moduleOptions.configPath)
      contentPaths.push(...layerPaths(nuxt.options.srcDir))
    }

    // Watch the Tailwind config file to restart the server
    if (nuxt.options.dev) {
      configPaths.forEach(path => nuxt.options.watch.push(path))
    }

    // Recursively resolve each config and merge tailwind configs together.
    let tailwindConfig: any = {}
    for (const configPath of configPaths) {
      if (existsSync(configPath)) {
        let _tailwindConfig: any = {}
        _tailwindConfig = tryRequireModule(configPath, { clearCache: true })

        // Transform purge option from Array to object with { content }
        if (Array.isArray(_tailwindConfig.purge)) {
          _tailwindConfig.content = _tailwindConfig.purge
        }

        tailwindConfig = defu(_tailwindConfig, tailwindConfig)
      }
    }

    tailwindConfig.content = [...(tailwindConfig.content || []), ...contentPaths]

    // Merge with our default purgecss default
    tailwindConfig = defuArrayFn(tailwindConfig, moduleOptions.config)

    // Expose resolved tailwind config as an alias
    // https://tailwindcss.com/docs/configuration/#referencing-in-javascript
    if (moduleOptions.exposeConfig) {
      const resolveConfig = await import('tailwindcss/resolveConfig.js').then(r => r.default || r) as any
      const resolvedConfig = resolveConfig(tailwindConfig)
      const template = addTemplate({
        filename: 'tailwind.config.mjs',
        getContents: () => `export default ${JSON.stringify(resolvedConfig, null, 2)}`
      })
      addTemplate({
        filename: 'tailwind.config.d.ts',
        getContents: () => 'declare const config: import("tailwindcss/tailwind-config").TailwindConfig\nexport { config as default }',
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

    const cssPath = await resolvePath(moduleOptions.cssPath, { extensions: ['.css', '.sass', '.scss', '.less', '.styl'] })
    const injectPosition = ~~Math.min(moduleOptions.injectPosition, (nuxt.options.css || []).length + 1)

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
    }

    // Inject only if this file isn't listed already by user (e.g. user may put custom path both here and in css):
    const resolvedNuxtCss = await Promise.all(nuxt.options.css.map(p => resolvePath(p)))
    if (!resolvedNuxtCss.includes(resolvedCss)) {
      nuxt.options.css.splice(injectPosition, 0, resolvedCss)
    }

    /**
     * PostCSS 8 support for Nuxt 2
     */

    // Setup postcss plugins
    // https://tailwindcss.com/docs/using-with-preprocessors#future-css-features
    const postcssOptions =
      nuxt.options.postcss || /* nuxt 3 */
      nuxt.options.build.postcss.postcssOptions || /* older nuxt3 */
      nuxt.options.build.postcss as any
    postcssOptions.plugins = postcssOptions.plugins || {}
    postcssOptions.plugins['tailwindcss/nesting'] = postcssOptions.plugins['tailwindcss/nesting'] ?? {}
    postcssOptions.plugins['postcss-custom-properties'] = postcssOptions.plugins['postcss-custom-properties'] ?? {}
    postcssOptions.plugins.tailwindcss = tailwindConfig

    if (isNuxt2()) {
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
    if (nuxt.options.dev && moduleOptions.viewer) {
      const route = '/_tailwind'
      const createServer = await import('tailwind-config-viewer/server/index.js').then(r => r.default || r) as any
      const { withTrailingSlash, withoutTrailingSlash } = await import('ufo')
      const _viewerDevMiddleware = createServer({ tailwindConfigProvider: () => tailwindConfig, routerPrefix: route }).asMiddleware()
      const viewerDevMiddleware = (req, res) => {
        if (req.originalUrl === withoutTrailingSlash(route)) {
          res.writeHead(301, { Location: withTrailingSlash(req.originalUrl) })
          return res.end()
        }
        _viewerDevMiddleware(req, res)
      }
      addDevServerHandler({ route, handler: viewerDevMiddleware })
      nuxt.hook('listen', (_, listener) => {
        const viewerUrl = `${withoutTrailingSlash(listener.url)}${route}`
        logger.info(`Tailwind Viewer: ${chalk.underline.yellow(withTrailingSlash(viewerUrl))}`)
      })
    }
  }
})
