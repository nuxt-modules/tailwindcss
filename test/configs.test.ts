import { describe, test, expect, vi } from 'vitest'
import { mockedWarn } from 'consola'
import { useTestContext } from '@nuxt/test-utils'
import { setupNuxtTailwind } from './util'

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
      'ts-tailwind.config'
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
})
