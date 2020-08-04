const { join } = require('path')
const { setup, get } = require('@nuxtjs/module-test-utils')
const logger = require('@/logger')
const tailwindModule = require('..')
const defaultNuxtConfig = require('../lib/files/tailwind.config')

logger.mockTypes(() => jest.fn())

describe('ok', () => {
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

  test('render', async () => {
    const html = await get('/')
    expect(html).toContain('Get the coolest t-shirts from our brand new store')
    expect(html).not.toContain('.bg-pink-700')
  })

  test('include tailwind.css file in project css', () => {
    expect(nuxt.options.css).toHaveLength(1)
    expect(nuxt.options.css).toContain(join(__dirname, '..', 'lib', 'files', 'tailwind.css'))
  })

  test('build', () => {
    expect(nuxt.options.build.postcss.preset.stage).toBe(1)
    expect(nuxt.options.build.postcss.plugins).toBeDefined()
    expect(nuxt.options.build.postcss.plugins.tailwindcss).toMatchObject(defaultNuxtConfig)
  })
})
