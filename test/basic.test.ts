import { describe, test, expect } from 'vitest'
import { getVfsFile, r, setupNuxtTailwind } from './utils'

describe('tailwindcss module', async () => {
  await setupNuxtTailwind({
    exposeConfig: { level: 2, alias: '#twcss' },
    quiet: false,
    // viewer: { endpoint: '_tw' },
    cssPath: r('tailwind.css'),
  })

  test('default js config is merged in', () => {
    const vfsFile = getVfsFile('test-tailwind.config.mjs')
    // set from default config tailwind.config.js
    expect(vfsFile).contains('"primary": "#f1e05a"')
  })

  test('expose config', () => {
    const vfsFile = getVfsFile('tailwind/expose/theme/flexBasis.mjs')
    // check default tailwind default animation exists
    expect(vfsFile).contains('"full": _full, "0.5": "0.125rem"')
    expect(vfsFile).contains('export { config as default')
  })

  test('expose config variable', () => {
    const vfsFile = getVfsFile('tailwind/expose/theme/animation.mjs')
    expect(vfsFile).contains('const _pulse = "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"')
  })

  // test('viewer works', async () => {
  //   const html = await $fetch('/_tw')
  //   expect(html).contains("tailwind-config-viewer doesn't work properly without JavaScript enabled")
  // })
})
