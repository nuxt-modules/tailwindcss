import { join, relative } from 'path'
import { get, setupTest, mockConsola, getNuxt } from '@nuxt/test-utils'

describe('tailwindcss module', () => {
  const rootDir = join(__dirname, '..', 'example')
  const logger = mockConsola()

  setupTest({
    server: true,
    testDir: __dirname,
    fixture: rootDir,
    config: {
      tailwindcss: {
        exposeConfig: true,
        configPath: join(__dirname, 'fixture', 'tailwind.config.js'),
        cssPath: join(__dirname, 'fixture', 'tailwind.css')
      }
    }
  })

  test('render', async () => {
    const html = await get('/').then(r => r.body)
    expect(html).toContain('Ready to dive in?')
    expect(html).not.toContain('.bg-pink-700')
  })

  test('custom paths', () => {
    const nuxt = getNuxt()
    expect(logger.info).toHaveBeenNthCalledWith(1, `Using Tailwind CSS from ~/${relative(rootDir, nuxt.options.tailwindcss.cssPath)}`)
    expect(logger.info).toHaveBeenNthCalledWith(2, `Merging Tailwind config from ~/${relative(rootDir, nuxt.options.tailwindcss.configPath)}`)
  })

  test('include custom tailwind.css file in project css', () => {
    const nuxt = getNuxt()
    expect(nuxt.options.css).toHaveLength(1)
    expect(nuxt.options.css).toContain(nuxt.options.tailwindcss.cssPath)
  })

  test.skip('merged the tailwind default config', () => {
    const nuxt = getNuxt()
    expect(nuxt.options.build.postcss.plugins.tailwindcss.content).toContain(`${rootDir}/nuxt.config.{js,ts}`)
    expect(nuxt.options.build.postcss.plugins.tailwindcss.content).toContain('content/**/*.md')
  })
})
