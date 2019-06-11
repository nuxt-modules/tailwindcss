const { resolve } = require('path')
const { pathExists, copy } = require('fs-extra')
const logger = require('consola').withScope('@nuxtjs/tailwindcss')

class ModuleUtils {
  constructor(nuxt, cwd) {
    this.nuxt = nuxt
    this.srcDir = nuxt.options.srcDir
    this.cwd = cwd
  }

  resolveTemplate(path) {
    return resolve(this.cwd, 'templates', path)
  }

  async ensureTemplateFile(from, to) {
    const destPath = resolve(this.srcDir, to)
    const relativePath = destPath.replace(this.srcDir, '~')
    const fileExists = await pathExists(destPath)

    if (fileExists) {
      return true
    }
    try {
      // Copy docs: https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy.md
      await copy(this.resolveTemplate(from), destPath)
      logger.success(`${relativePath} created`)
      return true
    } catch (err) {
      logger.warn(`Could not create ${relativePath}:`, err.message)
      return false
    }
  }
}

module.exports = ModuleUtils
