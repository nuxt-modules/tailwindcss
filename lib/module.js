import { resolve } from 'path'
import ModuleUtils from './utils'

export default async function (moduleOptions) {
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
  ** Add nuxt-purgecss module and set config
  */
  const defaultPurgeCSS = { mode: 'postcss' }
  const purgeCSS = Object.assign(defaultPurgeCSS, this.options.purgeCSS || {})
  await this.requireModule(['nuxt-purgecss', purgeCSS])

  /*
  ** Set PostCSS config
  */
  this.options.build.postcss.plugins = this.options.build.postcss.plugins || {}
  this.options.build.postcss.plugins.tailwindcss = this.options.build.postcss.plugins.tailwindcss || resolve(srcDir, 'tailwind.config.js')
}

module.exports.meta = require('../package.json')
