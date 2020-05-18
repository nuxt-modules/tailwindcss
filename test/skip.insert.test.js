const { join } = require('path')
const { remove } = require('fs-extra')
const { setup } = require('@nuxtjs/module-test-utils')
const logger = require('@/logger')
const tailwindModule = require('..')

logger.mockTypes(() => jest.fn())

describe('skip insert', () => {
  let nuxt

  beforeAll(async () => {
    const rootDir = join(__dirname, '..', 'example')
    const config = {
      rootDir,
      css: ['@/custom/skip.css', '@/custom/tailwind.css'],
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

  test('include custom tailwind.css file in project css', () => {
    expect(nuxt.options.css).toHaveLength(2)
    expect(nuxt.options.css[1]).toEqual(nuxt.resolver.resolveAlias(join(nuxt.options.srcDir, nuxt.options.tailwindcss.cssPath)))
  })
})
