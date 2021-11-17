import { join } from 'path'
import { fileURLToPath } from 'url'
import { loadNuxt, buildNuxt } from '@nuxt/kit'
import { $fetch } from 'ohmyfetch'
import { expect } from 'chai'

describe('tailwindcss module', () => {
  const rootDir = join(fileURLToPath(import.meta.url), '..', 'fixture')
  let nuxt
  let baseURL
  before(async function () {
    this.timeout(60000)
    nuxt = await loadNuxt({
      rootDir,
      config: {
        tailwindcss: {
          exposeConfig: true,
          configPath: join(rootDir, 'tailwind.config.js'),
          cssPath: join(rootDir, 'tailwind.css')
        }
      }
    })
    await buildNuxt(nuxt)
    process.env.PORT = 6000
    await import(join(rootDir, '.output/server/index.mjs'))
    baseURL = 'http://localhost:6000'
  })

  after(async () => {
    await nuxt.close()
    process.exit(0)
  })


  it('render', async () => {
    const html = await $fetch('/', { baseURL })
    expect(html).to.contain('Ready to dive in?')
    expect(html).not.to.contain('.bg-pink-700')
  })

  // test('custom paths', () => {
  //   const nuxt = getNuxt()
  //   expect(logger.info).toHaveBeenNthCalledWith(1, `Using Tailwind CSS from ~/${relative(rootDir, nuxt.options.tailwindcss.cssPath)}`)
  //   expect(logger.info).toHaveBeenNthCalledWith(2, `Merging Tailwind config from ~/${relative(rootDir, nuxt.options.tailwindcss.configPath)}`)
  // })

  it('include custom tailwind.css file in project css', () => {
    expect(nuxt.options.css.length).to.eq(1)
    expect(nuxt.options.css).to.contain(nuxt.options.tailwindcss.cssPath)
  })

  // test.skip('merged the tailwind default config', () => {
  //   const nuxt = getNuxt()
  //   expect(nuxt.options.build.postcss.plugins.tailwindcss.purge.content).toContain(`${rootDir}/nuxt.config.{js,ts}`)
  //   expect(nuxt.options.build.postcss.plugins.tailwindcss.purge.content).toContain('content/**/*.md')
  // })
})
