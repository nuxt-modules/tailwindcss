const { resolve } = require('path')
const logger = require('consola').withScope('@nuxtjs/tailwindcss')
const ModuleUtils = require('./utils')

module.exports = async function (moduleOptions) {
  // eslint-disable-next-line no-unused-vars
  const options = {
    ...this.options.tailwindcss,
    ...moduleOptions
  }
  const isBuild = this.options._build
  const { srcDir } = Object.assign({}, this.options)
  const utils = new ModuleUtils(this.nuxt, __dirname)
  const cssPath = this.nuxt.resolver.resolveAlias(options.cssPath || resolve(srcDir, this.options.dir.assets, 'css', 'tailwind.css'))
  const configPath = this.nuxt.resolver.resolveAlias(options.configPath || resolve(srcDir, 'tailwind.config.js'))

  /*
  ** Generates if not exists:
  ** - @/assets/css/tailwind.css
  ** - tailwind.config.js
  */
  const tailwindCSSExists = await utils.ensureTemplateFile('./tailwind.css', cssPath)
  // Include CSS file in project css
  if (tailwindCSSExists) {
    this.options.css.unshift(cssPath)
  }
  await utils.ensureTemplateFile('./tailwind.config.js', configPath)

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
    const defaultPurgeCSS = { mode: 'postcss' }
    const purgeCSS = Object.assign(defaultPurgeCSS, this.options.purgeCSS || {})
    await this.requireModule(['nuxt-purgecss', purgeCSS])
  }
}

module.exports.meta = require('../package.json')
