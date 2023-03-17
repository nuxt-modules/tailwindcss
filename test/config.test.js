const { join, relative } = require('path')
const { setup, get } = require('@nuxtjs/module-test-utils')
const tailwindModule = require('..')
const logger = require('@/logger')

logger.mockTypes(() => jest.fn())
const rootDir = join(__dirname, '..', 'example')

describe('config', () => {
  let nuxt

  beforeAll(async () => {
    const config = {
      rootDir,
      buildModules: [
        tailwindModule
      ],
      tailwindcss: {
        exposeConfig: true,
        configPath: join(__dirname, 'mock', 'tailwind.config.js'),
        cssPath: join(__dirname, 'mock', 'tailwind.css')
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

  test('custom paths', () => {
    expect(logger.info).toHaveBeenNthCalledWith(1, `Using Tailwind CSS from ~/${relative(rootDir, nuxt.options.tailwindcss.cssPath)}`)
    expect(logger.info).toHaveBeenNthCalledWith(2, `Merging Tailwind config from ~/${relative(rootDir, nuxt.options.tailwindcss.configPath)}`)
  })

  test('include custom tailwind.css file in project css', () => {
    expect(nuxt.options.css).toHaveLength(1)
    expect(nuxt.options.css).toContain(nuxt.options.tailwindcss.cssPath)
  })

  test('merged the tailwind default config', () => {
    expect(nuxt.options.build.postcss.postcssOptions.plugins.tailwindcss.purge.content).toContain(`${rootDir}/nuxt.config.{js,ts}`)
    expect(nuxt.options.build.postcss.postcssOptions.plugins.tailwindcss.purge.content).toContain('content/**/*.md')
  })
})
