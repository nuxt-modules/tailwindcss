const { join, relative } = require('path')
const { setup, get } = require('@nuxtjs/module-test-utils')
const logger = require('@/logger')
const tailwindModule = require('..')

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
      components: true,
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
    expect(html).toContain('Ready to dive in?')
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
    expect(nuxt.options.build.postcss.plugins.tailwindcss.purge).toContain(`${rootDir}/nuxt.config.{js,ts}`)
    expect(nuxt.options.build.postcss.plugins.tailwindcss.purge).toContain('content/**/*.md')
  })
})
