const { join } = require('path')
const { setup } = require('@nuxtjs/module-test-utils')
const logger = require('@/logger')
// Mock fs-extra
require('fs-extra').pathExists = jest.fn().mockImplementation(() => Promise.resolve(false))
require('fs-extra').copy = jest.fn().mockImplementation(() => Promise.reject(new Error('Error when copy')))
const tailwindModule = require('..')

logger.mockTypes(() => jest.fn())

describe('fail', () => {
  let nuxt

  beforeAll(async () => {
    const rootDir = join(__dirname, '..', 'example')
    const config = {
      rootDir,
      buildModules: [
        tailwindModule
      ],
      tailwindcss: {
        exposeConfig: true
      }
    }

    nuxt = (await setup(config)).nuxt
  }, 60000)

  afterAll(async () => {
    await nuxt.close()
  })

  beforeEach(() => {
    logger.clear()
  })

  test('when copy files', () => {
    expect(logger.warn).toHaveBeenNthCalledWith(1, 'Could not create ~/tailwind.config.js:', 'Error when copy')
    expect(logger.warn).toHaveBeenNthCalledWith(2, 'Could not create ~/assets/css/tailwind.css:', 'Error when copy')
    expect(nuxt.options.css).toHaveLength(0)
  })
})
