import { resolve } from 'path'
import { pathExists, copy } from 'fs-extra'
import consola from 'consola'

const logger = consola.withScope('@nuxtjs/tailwindcss')

class ModuleUtils {
  constructor(nuxt, cwd) {
    this.nuxt = nuxt
    this.srcDir = nuxt.options.srcDir
    this.cwd = cwd
  }

  resolveTemplate(path) {
    return resolve(this.cwd, 'templates', path)
  }

  async ensureTemplateFile(path) {
    const destPath = resolve(this.srcDir, path)
    const relativePath = destPath.replace(this.srcDir, '~')
    const fileExists = await pathExists(destPath)

    if (fileExists) {
      return true
    }
    try {
      // Copy docs: https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy.md
      await copy(this.resolveTemplate(path), destPath)
      logger.success(`${relativePath} created`)
      return true
    } catch (err) {
      logger.warn(`Could not create ${relativePath}:`, err.message)
      return false
    }
  }
}

export default ModuleUtils
