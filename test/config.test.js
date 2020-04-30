const { join } = require('path')
const { remove } = require('fs-extra')
const { setup, get } = require('@nuxtjs/module-test-utils')
const logger = require('@/logger')
const tailwindModule = require('..')

logger.mockTypes(() => jest.fn())

describe('config', () => {
  let nuxt

  beforeAll(async () => {
    const rootDir = join(__dirname, '..', 'example')
    const config = {
      rootDir,
      buildModules: [
        tailwindModule
      ],
      tailwindcss: {
        exposeConfig: true,
        configPath: 'custom/tailwind.js',
        cssPath: 'custom/tailwind.css'
      }
    }

    nuxt = (await setup(config)).nuxt
  }, 60000)

  afterAll(async () => {
    await nuxt.close()
    await remove(join(nuxt.options.srcDir, 'custom'))
  })

  beforeEach(() => {
    logger.clear()
  })

  test('render', async () => {
    const html = await get('/')
    expect(html).toContain('Get the coolest t-shirts from our brand new store')
    expect(html).not.toContain('.bg-pink-700')
  })

  test('custom paths', () => {
    expect(logger.success).toHaveBeenNthCalledWith(1, `~/${nuxt.options.tailwindcss.configPath} created`)
    expect(logger.success).toHaveBeenNthCalledWith(2, `~/${nuxt.options.tailwindcss.cssPath} created`)
  })

  test('include custom tailwind.css file in project css', () => {
    expect(nuxt.options.css).toHaveLength(1)
    expect(nuxt.options.css).toContain(join(nuxt.options.srcDir, nuxt.options.tailwindcss.cssPath))
  })
})
