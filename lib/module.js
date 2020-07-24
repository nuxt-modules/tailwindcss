const { join, resolve } = require('path')
const defu = require('defu')
const { ensureTemplateFile } = require('./utils')

module.exports = async function (moduleOptions) {
  const { nuxt, addTemplate } = this
<<<<<<< HEAD
  const options = defu(moduleOptions, nuxt.options.tailwindcss, {
    configPath: 'tailwind.config.js',
    cssPath: join(nuxt.options.dir.assets, 'css', 'tailwind.css'),
    exposeConfig: false
  })
=======
  const options = {
    configPath: 'tailwind.config.js',
    cssPath: join(nuxt.options.dir.assets, 'css', 'tailwind.css'),
    exposeConfig: false,
    ...nuxt.options.tailwindcss,
    ...moduleOptions
  }
>>>>>>> feat!: handle hook for config merging

  const configPath = nuxt.resolver.resolveAlias(options.configPath)
  const cssPath = nuxt.resolver.resolveAlias(options.cssPath)

  /*
  ** Generates if not exists:
  ** - tailwind.config.js
  ** - @/assets/css/tailwind.css
  */
  await ensureTemplateFile(nuxt.options.srcDir, 'tailwind.config.js', configPath)
  const tailwindCSSExists = await ensureTemplateFile(nuxt.options.srcDir, 'tailwind.css', cssPath)

  // Include CSS file in project css
  if (tailwindCSSExists) {
    nuxt.options.css.unshift(cssPath)
  }

  // Watch the Tailwind config file to restart the server
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

    // Get and extend the Tailwind config
    let tailwindConfig = require(configPath)
    const defaultConfig = require('./tailwind.config.defaults.js')
    // Add purgecss default
    tailwindConfig = defu(tailwindConfig, defaultConfig)
    // Let modules extend the tailwind config
    await nuxt.hook('tailwindcss:config', tailwindConfig)

    /* istanbul ignore if */
    if (Array.isArray(postcss.plugins)) {
      postcss.plugins.push(require('tailwindcss')(tailwindConfig))
    } else if (typeof postcss.plugins === 'object') {
      postcss.plugins.tailwindcss = require('tailwindcss')(tailwindConfig)
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
      addTemplate({
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
}

module.exports.meta = require('../package.json')
