const { resolve } = require('path')
const ModuleUtils = require('./utils')

module.exports = async function (moduleOptions) {
  // eslint-disable-next-line no-unused-vars
  const options = {
    ...this.options.tailwindcss,
    ...moduleOptions
  }
  const { srcDir } = Object.assign({}, this.options)
  const utils = new ModuleUtils(this.nuxt, __dirname)

  /*
  ** Generates if not exists:
  ** - @/assets/css/tailwind.css
  ** - tailwind.config.js
  */
  const tailwindCSSExists = await utils.ensureTemplateFile('./assets/css/tailwind.css')
  // Include CSS file in project css
  if (tailwindCSSExists) {
    this.options.css.unshift('@/assets/css/tailwind.css')
  }
  await utils.ensureTemplateFile('./tailwind.config.js')

  /*
  ** Set PostCSS config
  ** It has to be set before `nuxt-purgecss`
  */
  this.options.build.postcss.plugins = this.options.build.postcss.plugins || {}
  this.options.build.postcss.plugins.tailwindcss = this.options.build.postcss.plugins.tailwindcss || resolve(srcDir, 'tailwind.config.js')

  /*
  ** Add nuxt-purgecss module and set config
  */
  const defaultPurgeCSS = { mode: 'postcss' }
  const purgeCSS = Object.assign(defaultPurgeCSS, this.options.purgeCSS || {})
  await this.requireModule(['nuxt-purgecss', purgeCSS])
}

module.exports.meta = require('../package.json')
