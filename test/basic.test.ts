import { useTestContext, $fetch } from '@nuxt/test-utils'
import { describe, test, expect, vi } from 'vitest'
import { mockedInfo } from 'consola'
import { r, setupNuxtTailwind } from './util'

describe('tailwindcss module', async () => {
  vi.mock('consola', async () => {
    const { default: mod } = (await vi.importActual<typeof import('consola')>('consola'))
    mod.withScope = () => mod
    mod.info = vi.fn()
    return { default: mod, mockedInfo: mod.info }
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
    const nuxt = useTestContext().nuxt

    expect(mockedInfo.mock.calls[0]).contains('Using Tailwind CSS from ~/tailwind.css')

    expect(nuxt.options.css).toHaveLength(1)
    expect(nuxt.options.css[0]).toEqual(nuxt.options.tailwindcss.cssPath)
  })

  test('default js config is merged in', () => {
    const nuxt = useTestContext().nuxt
    const vfsKey = Object.keys(nuxt.vfs).find(k => k.includes('tailwind.config.'))
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
    const nuxt = useTestContext().nuxt
    const vfsKey = Object.keys(nuxt.vfs).find(k => k.includes('tailwind.config/theme/animation.'))
    // check default tailwind default animation exists
    expect(nuxt.vfs[vfsKey]).contains('"pulse": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"')
  })
})
