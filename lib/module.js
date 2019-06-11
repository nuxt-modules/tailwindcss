const { join } = require('path')
const { ensureTemplateFile } = require('./utils')
const logger = require('./logger')

module.exports = async function (moduleOptions) {
  const options = {
    configPath: 'tailwind.config.js',
    cssPath: join(this.options.dir.assets, 'css', 'tailwind.css'),
    ...this.options.tailwindcss,
    ...moduleOptions
  }

  const isBuild = this.options._build
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

  /*
  ** Set PostCSS config
  ** It has to be set before `nuxt-purgecss`
  ** only for `nuxt dev` and `nuxt build` commands
  */
  if (isBuild) {
    logger.info('postcss-preset-env stage is set to 1 for supporting advanced css features')
    this.options.build.postcss.preset.stage = 1 // see https://tailwindcss.com/docs/using-with-preprocessors#future-css-features
    this.options.build.postcss.plugins = this.options.build.postcss.plugins || {}
    this.options.build.postcss.plugins.tailwindcss = this.options.build.postcss.plugins.tailwindcss || configPath
  }

  /*
  ** Add nuxt-purgecss module and set config
  ** only for `nuxt build` command
  */
  if (!this.options.dev && isBuild) {
    const purgeCSS = { mode: 'postcss', ...(this.options.purgeCSS || {}) }
    await this.requireModule(['nuxt-purgecss', purgeCSS])
  }
}

module.exports.meta = require('../package.json')
