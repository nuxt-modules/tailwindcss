import { join, resolve, relative } from 'path'
import { existsSync } from 'fs'
import defu from 'defu'
import chalk from 'chalk'
import { joinURL, withTrailingSlash } from 'ufo'
import consola from 'consola'
import { defineNuxtModule, installModule, addTemplate, addServerMiddleware, resolveAlias, requireModule } from '@nuxt/kit'
import { name, version } from '../package.json'
import defaultTailwindConfig from './tailwind.config'

const logger = consola.withScope('nuxt:tailwindcss')

export interface ModuleHooks {
  'tailwindcss:config': any // TODO
}

export default defineNuxtModule({
  meta: {
    name,
    version,
    configKey: 'tailwindcss'
  },
  defaults: nuxt => ({
    configPath: 'tailwind.config.js',
    cssPath: join(nuxt.options.dir.assets, 'css', 'tailwind.css'),
    exposeConfig: false,
    config: defaultTailwindConfig(nuxt.options),
    viewer: nuxt.options.dev,
    injectPosition: 0
  }),
  async setup (moduleOptions, nuxt) {
    const configPath = resolveAlias(moduleOptions.configPath, nuxt.options.alias)
    const cssPath = moduleOptions.cssPath && resolveAlias(moduleOptions.cssPath, nuxt.options.alias)
    const injectPosition = ~~Math.min(moduleOptions.injectPosition, (nuxt.options.css || []).length + 1)

    // Extend postcss config
    // https://tailwindcss.com/docs/using-with-preprocessors#future-css-features
    nuxt.options.build.postcss = defu(nuxt.options.build.postcss, {
      plugins: {
        'postcss-nesting': {},
        'postcss-custom-properties': {}
      }
    })

    // Require postcss@8
    await installModule('@nuxt/postcss8')

    // Include CSS file in project css
    /* istanbul ignore else */
    if (typeof cssPath === 'string') {
      if (existsSync(cssPath)) {
        logger.info(`Using Tailwind CSS from ~/${relative(nuxt.options.srcDir, cssPath)}`)
        nuxt.options.css.splice(injectPosition, 0, cssPath)
      } else {
        nuxt.options.css.splice(injectPosition, 0, resolve(__dirname, 'runtime', 'tailwind.css'))
      }
    }

    // Get and extend the Tailwind config
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

    // Watch the Tailwind config file to restart the server
    /* istanbul ignore if */
    if (nuxt.options.dev) {
      nuxt.options.watch.push(configPath)
    }

    // This hooks is called only for `nuxt dev` and `nuxt build` commands
    nuxt.hook('build:before', async () => {
      // Fix issue with postCSS that needs process.env.NODE_ENV
      /* istanbul ignore if */
      if (!nuxt.options.dev && !process.env.NODE_ENV) {
        process.env.NODE_ENV = 'production'
      }

      // Extend tailwindcss config
      // @ts-ignore TODO
      await nuxt.callHook('tailwindcss:config', tailwindConfig)

      // Compute hash
      tailwindConfig._hash = String(Date.now())

      if (moduleOptions.jit === true) {
        logger.warn('`tailwindcss.jit` option is unnecessary as it\'s now the default')
      }

      if (moduleOptions.mode === 'jit') {
        logger.warn('`tailwindcss.mode: \'jit\'` option is unnecessary as it\'s now the default')
      }

      // @ts-ignore TODO
      nuxt.options.build.postcss.plugins.tailwindcss = tailwindConfig

      /*
      ** Expose resolved tailwind config as an alias
      ** https://tailwindcss.com/docs/configuration/#referencing-in-javascript
      */
      if (moduleOptions.exposeConfig) {
        const resolveConfig = require('tailwindcss/resolveConfig')
        const resolvedConfig = resolveConfig(tailwindConfig)

        // Render as a json file in buildDir
        addTemplate({
          src: resolve(__dirname, 'runtime/tailwind.config.json'),
          fileName: 'tailwind.config.json',
          options: { config: resolvedConfig }
        })

        // Alias to ~tailwind.config
        nuxt.options.alias['~tailwind.config'] = resolve(nuxt.options.buildDir, 'tailwind.config.json')

        // Force chunk creation for long term caching
        const { cacheGroups } = nuxt.options.build.optimization.splitChunks
        cacheGroups.tailwindConfig = {
          test: /tailwind\.config/,
          chunks: 'all',
          priority: 10,
          name: true
        }
      }
    })

    /*
     ** Add /_tailwind UI
     */
    /* istanbul ignore if */
    if (nuxt.options.dev && moduleOptions.viewer) {
      const path = '/_tailwind/'

      // @ts-ignore
      process.nuxt = process.nuxt || {}
      // @ts-ignore
      process.nuxt.$config = process.nuxt.$config || {}
      // @ts-ignore
      process.nuxt.$config.tailwind = {
        viewerPath: path,
        getConfig: () => tailwindConfig
      }

      addServerMiddleware({ path, handler: require.resolve('./runtime/config-viewer') })

      nuxt.hook('listen', () => {
        const url = withTrailingSlash(joinURL(nuxt.server.listeners && nuxt.server.listeners[0] ? nuxt.server.listeners[0].url : '/', path))
        nuxt.options.cli.badgeMessages.push(
          `Tailwind Viewer: ${chalk.underline.yellow(url)}`
        )
      })
    }
  }
})
