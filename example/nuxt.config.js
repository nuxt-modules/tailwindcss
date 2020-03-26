const { resolve } = require('path')

function lazyLoadModule (opts) {
  return require('../').call(this, opts)
}

module.exports = {
  rootDir: resolve(__dirname, '..'),
  buildDir: resolve(__dirname, '.nuxt'),
  srcDir: __dirname,
  modules: [
    [lazyLoadModule, { exposeConfig: true }]
  ]
}
