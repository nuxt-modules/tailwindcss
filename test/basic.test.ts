import { useTestContext, $fetch } from '@nuxt/test-utils'
import { describe, test, expect, vi, afterAll } from 'vitest'
import { r, setupNuxtTailwind } from './util'

describe('tailwindcss module', async () => {
  // Consola will by default set the log level to warn in test, we trick it into thinking we're in debug mode
  process.env.DEBUG = 'nuxt:*'
  // // Running dev environment for setup in test-utils to test dev options
  // process.env.NUXT_TEST_DEV = true

  const spyStderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => undefined!)
  const spyStdout = vi.spyOn(process.stdout, 'write').mockImplementation(() => undefined!)

  afterAll(() => {
    spyStderr.mockRestore()
    spyStdout.mockRestore()
  })

  await setupNuxtTailwind({
    exposeConfig: { level: 2, alias: '#twcss' },
    // viewer: { endpoint: '_tw' },
    cssPath: r('tailwind.css'),
    quiet: false
  })

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

  test('expose config alias', () => {
    const nuxt = useTestContext().nuxt!
    // const vfsKey = Object.keys(nuxt.vfs).find(k => k.includes('tsconfig'))! // tsconfig is not in vfs in test-build env
    // const { compilerOptions: {paths} } = destr(nuxt.vfs[vfsKey].slice(nuxt.vfs[vfsKey].indexOf('{')))

    const vfsKey = Object.keys(nuxt.vfs).find(k => k.includes('tailwind.config.d.ts'))!
    expect(nuxt.vfs[vfsKey]).contains('declare module "#twcss"')
  })

  // test('viewer works', async () => {
  //   const html = await $fetch('/_tw')
  //   expect(html).contains("tailwind-config-viewer doesn't work properly without JavaScript enabled")
  // })
})
