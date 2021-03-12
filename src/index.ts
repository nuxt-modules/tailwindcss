import { join, resolve, relative } from 'path'
import { existsSync } from 'fs'
import defu from 'defu'
import clearModule from 'clear-module'
import chalk from 'chalk'
import { joinURL, withTrailingSlash } from 'ufo'
import consola from 'consola'
import { name, version } from '../package.json'
import defaultTailwindConfig from './tailwind.config'

const logger = consola.withScope('nuxt:tailwindcss')

async function tailwindCSSModule (moduleOptions) {
  const { nuxt } = this
  const options = defu.arrayFn(moduleOptions, nuxt.options.tailwindcss, {
    configPath: 'tailwind.config.js',
    cssPath: join(nuxt.options.dir.assets, 'css', 'tailwind.css'),
    exposeConfig: false,
    config: defaultTailwindConfig(nuxt.options),
    viewer: nuxt.options.dev,
    jit: false
  })

  const configPath = nuxt.resolver.resolveAlias(options.configPath)
  const cssPath = nuxt.resolver.resolveAlias(options.cssPath)

  // Extend postcss config
  // https://tailwindcss.com/docs/using-with-preprocessors#future-css-features
  nuxt.options.build.postcss = defu(nuxt.options.build.postcss, {
    plugins: {
      'postcss-nested': {},
      'postcss-custom-properties': {}
    }
  })

  // Require postcss@8
  await this.addModule('@nuxt/postcss8')

  // Include CSS file in project css
  if (existsSync(cssPath)) {
    logger.info(`Using Tailwind CSS from ~/${relative(nuxt.options.srcDir, cssPath)}`)
    nuxt.options.css.unshift(cssPath)
  } else {
    nuxt.options.css.unshift(resolve(__dirname, 'runtime', 'tailwind.css'))
  }

  // Get and extend the Tailwind config
  let tailwindConfig: any = {}
  if (existsSync(configPath)) {
    clearModule(configPath)
    tailwindConfig = nuxt.resolver.requireModule(configPath)
    logger.info(`Merging Tailwind config from ~/${relative(this.options.srcDir, configPath)}`)
    // Transform purge option from Array to object with { content }
    if (Array.isArray(tailwindConfig.purge)) {
      tailwindConfig.purge = { content: tailwindConfig.purge }
    }
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

    // Set tailwindcss config
    await nuxt.callHook('tailwindcss:config', tailwindConfig)

    // Add Tailwind PostCSS plugin
    const tailwindConfigFile = resolve(nuxt.options.buildDir, 'tailwind.config.js')
    if (options.jit !== false) {
      nuxt.options.build.postcss.plugins['@tailwindcss/jit'] = tailwindConfigFile
      logger.info('Tailwind JIT activated')
    } else {
      nuxt.options.build.postcss.plugins.tailwindcss = tailwindConfigFile
    }

    /*
    ** Expose resolved tailwind config as an alias
    ** https://tailwindcss.com/docs/configuration/#referencing-in-javascript
    */
    const resolveConfig = require('tailwindcss/resolveConfig')
    const resolvedConfig = resolveConfig(tailwindConfig)

    // Resolve config

    // Render as a json file in buildDir
    /**
       * nuxt ModuleContainer bind 'this' to addTemplate until v2.13.0，use this.addTemplate to compat with low version
       * issue: https://github.com/nuxt-community/tailwindcss-module/issues/224
       */
    this.addTemplate({
      src: resolve(__dirname, 'runtime/tailwind.config.js'),
      fileName: 'tailwind.config.js',
      options: { config: resolvedConfig }
    })
    this.addTemplate({
      src: resolve(__dirname, 'runtime/tailwind.config.json'),
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
  })

  /*
   ** Add /_tailwind UI
   */
  /* istanbul ignore if */
  if (nuxt.options.dev && options.viewer) {
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

    this.addServerMiddleware({ path, handler: require.resolve('./runtime/config-viewer') })

    nuxt.hook('listen', () => {
      const url = withTrailingSlash(joinURL(nuxt.server.listeners && nuxt.server.listeners[0] ? nuxt.server.listeners[0].url : '/', path))
      nuxt.options.cli.badgeMessages.push(
        `Tailwind Viewer: ${chalk.underline.yellow(url)}`
      )
    })
  }
}

tailwindCSSModule.meta = { name, version }

export default tailwindCSSModule
