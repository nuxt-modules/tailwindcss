import { describe, test, expect, vi } from 'vitest'
import { useTestContext } from '@nuxt/test-utils'
import destr from 'destr'
import { setupNuxtTailwind } from './util'

describe('tailwindcss module configs', async () => {
  const spyStderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => undefined!)
  const spyStdout = vi.spyOn(process.stdout, 'write').mockImplementation(() => undefined!)

  afterAll(() => {
    spyStderr.mockRestore()
    spyStdout.mockRestore()
  })

  await setupNuxtTailwind({
    exposeConfig: true,
    configPath: [
      'alt-tailwind.config.js',
      'malformed-tailwind.config',
      'ts-tailwind.config',
      'override-tailwind.config.js',
      'content-obj.config'
    ],
    cssPath: 'tailwind.css'
  })

  test('throws error about malformed config', () => {
    expect(spyStderr).toBeCalledTimes(1)
    const output = spyStderr.mock.calls[0][0].toString()

    expect(output.split('\n')[0]).toMatchInlineSnapshot('"[warn] [nuxt:tailwindcss] Failed to load Tailwind config at: `./malformed-tailwind.config.js` Cannot find module \'something-that-doesnt-exist\'"')
    expect(output).contains('Failed to load Tailwind config at: `./malformed-tailwind.config.js`')
  })

  test('ts config file is loaded and merged', () => {
    const nuxt = useTestContext().nuxt!
    const vfsKey = Object.keys(nuxt.vfs).find(k => k.includes('tailwind.config.'))!
    // set from ts-tailwind.config.ts
    expect(nuxt.vfs[vfsKey]).contains('"typescriptBlue": "#007acc"')
  })

  test('js config file is loaded and merged', () => {
    const nuxt = useTestContext().nuxt!
    const vfsKey = Object.keys(nuxt.vfs).find(k => k.includes('tailwind.config.'))!
    // set from ts-tailwind.config.ts
    expect(nuxt.vfs[vfsKey]).contains('"javascriptYellow": "#f1e05a"')
  })

  test('content is overridden', () => {
    const nuxt = useTestContext().nuxt!
    const vfsKey = Object.keys(nuxt.vfs).find(k => k.includes('tailwind.config.'))!
    // set from override-tailwind.config.ts
    const contentFiles = destr(nuxt.vfs[vfsKey].replace(/^(module\.exports = )/, '')).content.files

    expect(contentFiles[0]).toBe('ts-content/**/*.md')
    expect(contentFiles[1]).toBe('./custom-theme/**/*.vue')
    expect(contentFiles.slice(2).filter(c => c.endsWith('vue')).length).toBe(2)
  })

  test('content merges with objects', () => {
    const nuxt = useTestContext().nuxt!
    const vfsKey = Object.keys(nuxt.vfs).find(k => k.includes('tailwind.config.'))!
    const { content } = destr(nuxt.vfs[vfsKey].replace(/^(module\.exports = )/, ''))

    expect(content.relative).toBeTruthy()
    expect(content.files.pop()).toBe('./my-components/**/*.tsx')
  })
})
