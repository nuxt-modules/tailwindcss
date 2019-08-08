const { join } = require('path')
const { ensureTemplateFile } = require('./utils')

module.exports = async function (moduleOptions) {
  const options = {
    configPath: 'tailwind.config.js',
    cssPath: join(this.options.dir.assets, 'css', 'tailwind.css'),
    ...this.options.tailwindcss,
    ...moduleOptions
  }

  const configPath = this.nuxt.resolver.resolveAlias(options.configPath)
  const cssPath = this.nuxt.resolver.resolveAlias(options.cssPath)

  /*
  ** Generates if not exists:
  ** - tailwind.config.js
  ** - @/assets/css/tailwind.css
  */
  await ensureTemplateFile(this.options.srcDir, 'tailwind.config.js', configPath)
  const tailwindCSSExists = await ensureTemplateFile(this.options.srcDir, 'tailwind.css', cssPath)

  // Include CSS file in project css
  if (tailwindCSSExists) {
    this.options.css.unshift(cssPath)
  }

  // This hooks is called only for `nuxt dev` and `nuxt build` commands
  this.nuxt.hook('build:before', async () => {
    /*
    ** Set PostCSS config (before nuxt-purgecss)
    */
    this.options.build.postcss.preset.stage = 1 // see https://tailwindcss.com/docs/using-with-preprocessors#future-css-features
    this.options.build.postcss.plugins = this.options.build.postcss.plugins || {}
    this.options.build.postcss.plugins.tailwindcss = this.options.build.postcss.plugins.tailwindcss || configPath
    /*
    ** Add nuxt-purgecss module and set config
    ** only for `nuxt build` command
    */
    if (!this.options.dev) {
      const purgeCSS = { mode: 'postcss', ...(this.options.purgeCSS || {}) }
      await this.requireModule(['nuxt-purgecss', purgeCSS])
    }
  })
}

module.exports.meta = require('../package.json')
