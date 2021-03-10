const { join, resolve, relative } = require('path')
const { pathExists } = require('fs-extra')
const defu = require('defu')
const clearModule = require('clear-module')
const chalk = require('chalk')
const { joinURL, withTrailingSlash } = require('ufo')

const logger = require('./logger')
const defaultTailwindConfig = require('./files/tailwind.config.js')

module.exports = async function (moduleOptions) {
  const { nuxt } = this
  const options = defu.arrayFn(moduleOptions, nuxt.options.tailwindcss, {
    configPath: 'tailwind.config.js',
    cssPath: join(nuxt.options.dir.assets, 'css', 'tailwind.css'),
    exposeConfig: false,
    config: defaultTailwindConfig(nuxt.options),
    viewer: nuxt.options.dev
  })

  const configPath = nuxt.resolver.resolveAlias(options.configPath)
  const cssPath = nuxt.resolver.resolveAlias(options.cssPath)

  // Include CSS file in project css
  if (await pathExists(cssPath)) {
    logger.info(`Using Tailwind CSS from ~/${relative(nuxt.options.srcDir, cssPath)}`)
    nuxt.options.css.unshift(cssPath)
  } else {
    nuxt.options.css.unshift(resolve(__dirname, 'files', 'tailwind.css'))
  }

  // Get and extend the Tailwind config
  let tailwindConfig = {}
  if (await pathExists(configPath)) {
    clearModule(configPath)
    tailwindConfig = nuxt.resolver.requireModule(configPath)
    logger.info(`Merging Tailwind config from ~/${relative(this.options.srcDir, configPath)}`)
  }
  // Merge with our default purgecss default
  tailwindConfig = defu.arrayFn(tailwindConfig, options.config)

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
    /*
    ** Set PostCSS config
    */
    const { postcss } = nuxt.options.build

    postcss.preset.stage = 1 // see https://tailwindcss.com/docs/using-with-preprocessors#future-css-features
    postcss.plugins = postcss.plugins || {}

    // Let modules extend the tailwind config
    await nuxt.callHook('tailwindcss:config', tailwindConfig)

    /* istanbul ignore if */
    if (Array.isArray(postcss.plugins)) {
      logger.error('Array syntax for postcss plugins is not supported with v3. Please use the object syntax: https://nuxtjs.org/guides/configuration-glossary/configuration-build#postcss')
    } else if (typeof postcss.plugins === 'object') {
      postcss.plugins.tailwindcss = tailwindConfig
    }

    /*
    ** Expose resolved tailwind config as an alias
    ** https://tailwindcss.com/docs/configuration/#referencing-in-javascript
    */
    if (options.exposeConfig) {
      // Resolve config
      const resolveConfig = require('tailwindcss/resolveConfig')
      const resolvedConfig = resolveConfig(tailwindConfig)

      // Render as a json file in buildDir
      /**
       * nuxt ModuleContainer bind 'this' to addTemplate until v2.13.0，use this.addTemplate to compat with low version
       * issue: https://github.com/nuxt-community/tailwindcss-module/issues/224
       */
      this.addTemplate({
        src: resolve(__dirname, 'templates/tailwind.config.json'),
        fileName: 'tailwind.config.json',
        options: { config: resolvedConfig }
      })

      // Alias to ~tailwind.config
      nuxt.options.alias['~tailwind.config'] =
        resolve(nuxt.options.buildDir, 'tailwind.config.json')

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
  if (nuxt.options.dev && options.viewer) {
    const path = '/_tailwind/'

    process.nuxt = process.nuxt || {}
    process.nuxt.$config = process.nuxt.$config || {}
    process.nuxt.$config.tailwind = {
      viewerPath: path,
      getConfig: () => tailwindConfig
    }

    this.addServerMiddleware({ path, handler: require.resolve('./serverMiddleware/tailwindConfigViewer') })

    nuxt.hook('listen', () => {
      const url = withTrailingSlash(joinURL(nuxt.server.listeners && nuxt.server.listeners[0] ? nuxt.server.listeners[0].url : '/', path))
      nuxt.options.cli.badgeMessages.push(
        `Tailwind Viewer: ${chalk.underline.yellow(url)}`
      )
    })
  }
}

module.exports.meta = require('../package.json')
