import { describe, test, expect, vi, afterAll } from 'vitest'
import { useTestContext } from '@nuxt/test-utils'
import destr from 'destr'
import { setupNuxtTailwind, r } from './util'
import { Config } from 'tailwindcss'

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
  },
  {
    dir: { plugins: 'my-pluggable-modules', modules: 'my-modular-plugins' },
    modules: [r('modules/cjs-config.ts'), '@nuxtjs/tailwindcss'],
    imports: { dirs: ['my-imports-dir1', 'my-imports-dir2'] },
    extensions: ['.json', '.mdc', '.mdx', '.coffee']
  })

  test('throws error about malformed config', () => {
    expect(spyStderr).toBeCalledTimes(1)
    const output = spyStderr.mock.calls[0][0].toString()

    expect(output.split('\n')[0]).toMatchInlineSnapshot('"[warn] [nuxt:tailwindcss] Failed to load Tailwind config at: `./malformed-tailwind.config.js` Cannot find module \'something-that-doesnt-exist\'"')
    expect(output).contains('Failed to load Tailwind config at: `./malformed-tailwind.config.js`')
  })

  test('ts config file is loaded and merged', () => {
    const nuxt = useTestContext().nuxt!
    const vfsKey = Object.keys(nuxt.vfs).find(k => k.includes('test-tailwind.config.'))!
    // set from ts-tailwind.config.ts
    expect(nuxt.vfs[vfsKey]).contains('"typescriptBlue": "#007acc"')
  })

  test('js config file is loaded and merged', () => {
    const nuxt = useTestContext().nuxt!
    const vfsKey = Object.keys(nuxt.vfs).find(k => k.includes('test-tailwind.config.'))!
    // set from ts-tailwind.config.ts
    expect(nuxt.vfs[vfsKey]).contains('"javascriptYellow": "#f1e05a"')
  })

  test('content is adaptive', () => {
    const nuxt = useTestContext().nuxt!
    const vfsKey = Object.keys(nuxt.vfs).find(k => k.includes('test-tailwind.config.'))!
    const { content: { files } } = destr<Omit<Config, 'content'> & { content: Extract<Config['content'], { relative?: boolean }> }>(nuxt.vfs[vfsKey].replace(/^(module\.exports = )/, ''))

    expect(files.find(c => /my-pluggable-modules|my-modular-plugins/.test(c))).toBeDefined()
    expect(files.filter(c => c.includes('my-imports-dir')).length).toBe(2)
    expect(files.find(c => c.includes('components/**/*'))?.includes('json,mdc,mdx,coffee')).toBeTruthy()
  })

  test('content is overridden', () => {
    const nuxt = useTestContext().nuxt!
    const vfsKey = Object.keys(nuxt.vfs).find(k => k.includes('test-tailwind.config.'))!
    // set from override-tailwind.config.ts
    const contentFiles = destr<Omit<Config, 'content'> & { content: Extract<Config['content'], { relative?: boolean }> }>(nuxt.vfs[vfsKey].replace(/^(module\.exports = )/, '')).content.files

    expect(contentFiles[0]).toBe('ts-content/**/*.md')
    expect(contentFiles[1]).toBe('./custom-theme/**/*.vue')
    expect(contentFiles.filter(c => /{[AE],[ae]}/.test(c)).length).toBe(0)
  })

  test('content merges with objects', () => {
    const nuxt = useTestContext().nuxt!
    const vfsKey = Object.keys(nuxt.vfs).find(k => k.includes('test-tailwind.config.'))!
    const { content } = destr<Omit<Config, 'content'> & { content: Extract<Config['content'], { relative?: boolean }> }>(nuxt.vfs[vfsKey].replace(/^(module\.exports = )/, ''))

    expect(content.relative).toBeTruthy()
    expect(content.files.pop()).toBe('./my-components/**/*.tsx')
  })
})
