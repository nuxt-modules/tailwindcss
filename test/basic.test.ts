import { useTestContext } from '@nuxt/test-utils'
import { describe, test, expect, vi, afterAll } from 'vitest'
import { r, setupNuxtTailwind } from './util'

describe('tailwindcss module', async () => {
  // Consola will by default set the log level to warn in test, we trick it into thinking we're in debug mode
  process.env.DEBUG = 'nuxt:*'

  const spyStderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => undefined!)
  const spyStdout = vi.spyOn(process.stdout, 'write').mockImplementation(() => undefined!)

  afterAll(() => {
    spyStderr.mockRestore()
    spyStdout.mockRestore()
  })

  await setupNuxtTailwind({
    exposeConfig: true,
    exposeLevel: 2,
    cssPath: r('tailwind.css')
  })

  //
  // test('tailwind works', async () => {
  //   const manifest = await $fetch('/_nuxt/manifest.json')
  //   // @ts-expect-error untyped
  //   const [, { css }] = Object.entries(manifest).find(([, v]) => v.isEntry)
  //   const cssContents = await $fetch(`/_nuxt/${css[0]}`) as string

  //   // test tailwind is the first entry
  //   expect(cssContents.startsWith('/*! tailwindcss v')).toBeTruthy()
  //   // test pages/index.vue is read
  //   expect(cssContents).toContain('.max-w-7xl')
  // })

  test('include custom tailwind.css file in project css', () => {
    const nuxt = useTestContext().nuxt!

    expect(nuxt.options.css).toHaveLength(1)
    expect(nuxt.options.css[0]).toEqual(nuxt.options.tailwindcss.cssPath.replace(/\\/g /* windows protocol */, '/'))

    expect(spyStderr).toHaveBeenCalledTimes(0)
    expect(spyStdout).toHaveBeenCalledTimes(1)
    expect(spyStdout.mock.calls[0][0]).contains('Using Tailwind CSS from ~/tailwind.css')
  })

  test('default js config is merged in', () => {
    const nuxt = useTestContext().nuxt!
    const vfsKey = Object.keys(nuxt.vfs).find(k => k.includes('tailwind.config.'))!
    // set from default config tailwind.config.js
    expect(nuxt.vfs[vfsKey]).contains('"primary": "#f1e05a"')
  })

  // @todo re-implement
  // test('custom paths', () => {
  //   const ctx = useTestContext()
  //
  //   expect(logger.info).toHaveBeenNthCalledWith(1, `Using Tailwind CSS from ~/${relative(rootDir, nuxt.options.tailwindcss.cssPath)}`)
  //   expect(logger.info).toHaveBeenNthCalledWith(2, `Merging Tailwind config from ~/${relative(rootDir, nuxt.options.tailwindcss.configPath)}`)
  // })
  //

  test('expose config', () => {
    const nuxt = useTestContext().nuxt!
    const vfsKey = Object.keys(nuxt.vfs).find(k => k.includes('tailwind.config/theme/flexBasis.'))!
    // check default tailwind default animation exists
    expect(nuxt.vfs[vfsKey]).contains('"full": _full, "0.5": "0.125rem"')
    expect(nuxt.vfs[vfsKey]).contains('export { config as default')
  })

  test('expose config variable', () => {
    const nuxt = useTestContext().nuxt!
    const vfsKey = Object.keys(nuxt.vfs).find(k => k.includes('tailwind.config/theme/animation.'))!
    expect(nuxt.vfs[vfsKey]).contains('const _pulse = "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"')
  })
})
