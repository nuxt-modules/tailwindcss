const { resolve } = require('path')

function lazyLoadModule () { return require('../').call(this) }

module.exports = {
  rootDir: resolve(__dirname, '..'),
  buildDir: resolve(__dirname, '.nuxt'),
  srcDir: __dirname,
  modules: [
    lazyLoadModule
  ],
  tailwindcss: {
    exposeConfig: true
  }
}
