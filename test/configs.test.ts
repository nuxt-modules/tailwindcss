import { describe, test, expect, vi } from 'vitest'
import { mockedWarn } from 'consola'
import { useTestContext } from '@nuxt/test-utils'
import { setupNuxtTailwind } from './util'
import destr from 'destr'

describe('tailwindcss module configs', async () => {
  vi.mock('consola', async () => {
    const { default: mod } = (await vi.importActual<typeof import('consola')>('consola'))
    mod.withScope = () => mod
    mod.info = vi.fn()
    mod.warn = vi.fn()
    return { default: mod, info: mod.info, mockedWarn: mod.warn }
  })

  await setupNuxtTailwind({
    exposeConfig: true,
    configPath: [
      'alt-tailwind.config.js',
      'malformed-tailwind.config',
      'ts-tailwind.config',
      'override-tailwind.config.js'
    ],
    cssPath: 'tailwind.css'
  })

  test('throws error about malformed config', () => {
    expect(mockedWarn.mock.calls[0][0]).toMatchInlineSnapshot('"Failed to load Tailwind config at: `./malformed-tailwind.config.js`"')
    expect(mockedWarn.mock.calls[0][0]).contains('Failed to load Tailwind config at: `./malformed-tailwind.config.js`')

    expect(mockedWarn.mock.calls[0].length).toBe(2)
  })

  test('ts config file is loaded and merged', () => {
    const nuxt = useTestContext().nuxt
    const vfsKey = Object.keys(nuxt.vfs).find(k => k.includes('tailwind.config.'))
    // set from ts-tailwind.config.ts
    expect(nuxt.vfs[vfsKey]).contains('"typescriptBlue": "#007acc"')
  })

  test('js config file is loaded and merged', () => {
    const nuxt = useTestContext().nuxt
    const vfsKey = Object.keys(nuxt.vfs).find(k => k.includes('tailwind.config.'))
    // set from ts-tailwind.config.ts
    expect(nuxt.vfs[vfsKey]).contains('"javascriptYellow": "#f1e05a"')
  })

  test('content is overridden', () => {
    const nuxt = useTestContext().nuxt
    const vfsKey = Object.keys(nuxt.vfs).find(k => k.includes('tailwind.config.'))
    // set from override-tailwind.config.ts
    const contentFiles = destr(nuxt.vfs[vfsKey].replace(/^(module\.exports = )/, '')).content.files
    expect(contentFiles.length).toBe(4)
    expect(contentFiles[0].endsWith('/test/fixture/basic/components/**/*.{vue,js,ts}')).toBe(true)
    expect(contentFiles[1]).toBe('./custom-theme/**/*.vue')
    expect(contentFiles.slice(2).filter(c => c.endsWith('vue')).length).toBe(2)
  })
})
