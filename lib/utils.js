const { resolve } = require('path')
const { pathExists, copy } = require('fs-extra')
const logger = require('./logger')

async function ensureTemplateFile (srcDir, from, to) {
  const relativePath = to.replace(srcDir, '~')
  const fileExists = await pathExists(to)

  if (fileExists) {
    return true
  }

  try {
    // Copy docs: https://github.com/jprichardson/node-fs-extra/blob/master/docs/copy.md
    await copy(resolve(__dirname, 'templates', from), to)
    logger.success(`${relativePath} created`)
    return true
  } catch (err) {
    logger.warn(`Could not create ${relativePath}:`, err.message)
    return false
  }
}

module.exports = {
  ensureTemplateFile
}
