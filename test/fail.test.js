jest.setTimeout(60000)
require('fs-extra').pathExists = jest.fn().mockImplementation(() => Promise.resolve(false))
require('fs-extra').copy = jest.fn().mockImplementation(() => Promise.reject(new Error('Error when copy')))

const { Nuxt, Builder } = require('nuxt-edge')
const config = require('../example/nuxt.config')
const logger = require('@/logger')

logger.mockTypes(() => jest.fn())

config.dev = false

let nuxt

describe('fail', () => {
  beforeAll(async () => {
    nuxt = new Nuxt(config)
    await nuxt.ready()
    await new Builder(nuxt).build()
  })

  afterAll(async () => {
    await nuxt.close()
  })

  beforeEach(() => {
    logger.clear()
  })

  test('when copy files', () => {
    expect(logger.warn).toHaveBeenNthCalledWith(1, `Could not create ~/tailwind.config.js:`, 'Error when copy')
    expect(logger.warn).toHaveBeenNthCalledWith(2, `Could not create ~/assets/css/tailwind.css:`, 'Error when copy')
    expect(nuxt.options.css).toHaveLength(0)
  })
})
