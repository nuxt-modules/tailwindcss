const { join } = require('path')
const { ensureTemplateFile } = require('./utils')

module.exports = async function (moduleOptions) {
  const options = {
    configPath: 'tailwind.config.js',
    cssPath: join(this.options.dir.assets, 'css', 'tailwind.css'),
    purgeCSSInDev: false,
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
    const { postcss } = this.options.build

    postcss.preset.stage = 1 // see https://tailwindcss.com/docs/using-with-preprocessors#future-css-features
    postcss.plugins = postcss.plugins || {}

    if (Array.isArray(postcss.plugins)) {
      postcss.plugins.push(require('tailwindcss')(configPath))
    } else if (typeof postcss.plugins === 'object') {
      postcss.plugins.tailwindcss = postcss.plugins.tailwindcss || configPath
    }

    /*
    ** Add nuxt-purgecss module and set config
    ** only for `nuxt build` command
    */
    const purgeCSSEnabled = this.options.dev === false || options.purgeCSSInDev === true
    if (purgeCSSEnabled) {
      const purgeCSS = {
        mode: 'postcss',
        enabled: purgeCSSEnabled,
        ...(this.options.purgeCSS || {})
      }
      await this.requireModule(['nuxt-purgecss', purgeCSS])
    }
  })
}

module.exports.meta = require('../package.json')
