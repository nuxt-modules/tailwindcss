import { join, relative } from 'path'
import { existsSync } from 'fs'
import { defuArrayFn } from 'defu'
import chalk from 'chalk'
import consola from 'consola'
import {
  defineNuxtModule,
  installModule,
  addTemplate,
  addDevServerHandler,
  requireModule,
  isNuxt2,
  createResolver,
  resolvePath,
  addVitePlugin
} from '@nuxt/kit'
import { name, version } from '../package.json'
import vitePlugin from './hmr'
import defaultTailwindConfig from './tailwind.config'

const logger = consola.withScope('nuxt:tailwindcss')

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
    config: defaultTailwindConfig(nuxt.options),
    viewer: true,
    exposeConfig: false,
    injectPosition: 0,
    disableHmrHotfix: false
  }),
  async setup (moduleOptions, nuxt) {
    const configPath = await resolvePath(moduleOptions.configPath)
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
        resolvedCss = createResolver(import.meta.url).resolve('runtime/tailwind.css')
      }
    }

    // Inject only if this file isn't listed already by user (e.g. user may put custom path both here and in css):
    const resolvedNuxtCss = await Promise.all(nuxt.options.css.map(p => resolvePath(p)))
    if (!resolvedNuxtCss.includes(resolvedCss)) {
      nuxt.options.css.splice(injectPosition, 0, resolvedCss)
    }

    // Extend the Tailwind config
    let tailwindConfig: any = {}
    if (existsSync(configPath)) {
      tailwindConfig = requireModule(configPath, { clearCache: true })
      logger.info(`Merging Tailwind config from ~/${relative(nuxt.options.srcDir, configPath)}`)
      // Transform purge option from Array to object with { content }
      if (Array.isArray(tailwindConfig.purge)) {
        tailwindConfig.content = tailwindConfig.purge
      }
    }

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

    // Watch the Tailwind config file to restart the server
    if (nuxt.options.dev) {
      nuxt.options.watch.push(configPath)
    }

    // Allow extending tailwindcss config by other modules
    // @ts-ignore
    const _tailwindConfig = await nuxt.callHook('tailwindcss:config', tailwindConfig)
    // Overwrite if returned
    if (_tailwindConfig) { tailwindConfig = _tailwindConfig }

    // Compute tailwindConfig hash
    tailwindConfig._hash = String(Date.now())

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

    if (nuxt.options.dev && !moduleOptions.disableHmrHotfix) {
      // Insert Vite plugin to work around HMR issue
      addVitePlugin(vitePlugin(tailwindConfig, nuxt.options.rootDir, resolvedCss))
    }

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
