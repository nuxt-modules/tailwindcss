import { join, relative } from 'path'
import { existsSync } from 'fs'
import defu from 'defu'
import chalk from 'chalk'
import { withTrailingSlash } from 'ufo'
import consola from 'consola'
import {
  defineNuxtModule,
  installModule,
  addTemplate,
  addServerMiddleware,
  requireModule,
  isNuxt2,
  createResolver,
  resolvePath
} from '@nuxt/kit'
import { name, version } from '../package.json'
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
    configPath: 'tailwind.config.js',
    cssPath: join(nuxt.options.dir.assets, 'css/tailwind.css'),
    config: defaultTailwindConfig(nuxt.options),
    viewer: true,
    exposeConfig: false,
    injectPosition: 0
  }),
  async setup (moduleOptions, nuxt) {
    const configPath = await resolvePath(moduleOptions.configPath)
    const cssPath = await resolvePath(moduleOptions.cssPath, { extensions: ['.css', '.sass', '.scss', '.less', '.styl'] })
    const injectPosition = ~~Math.min(moduleOptions.injectPosition, (nuxt.options.css || []).length + 1)

    // Include CSS file in project css
    if (typeof cssPath === 'string') {
      if (existsSync(cssPath)) {
        logger.info(`Using Tailwind CSS from ~/${relative(nuxt.options.srcDir, cssPath)}`)
        nuxt.options.css.splice(injectPosition, 0, cssPath)
      } else {
        logger.info('Using default Tailwind CSS file from runtime/tailwind.css')
        const resolver = createResolver(import.meta.url)
        nuxt.options.css.splice(injectPosition, 0, resolver.resolve('runtime/tailwind.css'))
      }
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
    tailwindConfig = defu.arrayFn(tailwindConfig, moduleOptions.config)

    // Expose resolved tailwind config as an alias
    // https://tailwindcss.com/docs/configuration/#referencing-in-javascript
    if (moduleOptions.exposeConfig) {
      const resolveConfig = await import('tailwindcss/resolveConfig.js').then(r => r.default || r)
      const resolvedConfig = resolveConfig(tailwindConfig)
      const template = addTemplate({
        filename: 'tailwind.config.mjs',
        getContents: () => `export default ${JSON.stringify(resolvedConfig, null, 2)}`
      })
      nuxt.options.alias['#tailwind-config'] = template.dst
    }

    // Watch the Tailwind config file to restart the server
    if (nuxt.options.dev) {
      nuxt.options.watch.push(configPath)
    }

    // Allow extending tailwindcss config by other modules
    // @ts-ignore
    await nuxt.callHook('tailwindcss:config', tailwindConfig)

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

    // Add _tailwind config viewer endpoint
    if (nuxt.options.dev && moduleOptions.viewer) {
      const path = '/_tailwind/'
      const createServer = await import('tailwind-config-viewer/server/index.js').then(r => r.default || r)
      const { withoutTrailingSlash } = await import('ufo')
      const _viewerDevMiddleware = createServer({ tailwindConfigProvider: () => tailwindConfig }).asMiddleware()
      const viewerDevMiddleware = (req, res) => {
        if (req.originalUrl === withoutTrailingSlash(path)) {
          res.writeHead(301, { Location: withTrailingSlash(req.originalUrl) })
          res.end()
        }
        _viewerDevMiddleware(req, res)
      }
      addServerMiddleware({ path, handler: viewerDevMiddleware })
      nuxt.hook('listen', (_, listener) => {
        const fullPath = `${withoutTrailingSlash(listener.url)}${path}`;
        logger.info(`Tailwind Viewer: ${chalk.underline.yellow(fullPath)}`);
      });
    }
  }
})
