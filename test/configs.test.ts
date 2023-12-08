import { describe, test, expect, vi, afterAll } from 'vitest'
import type { Config } from 'tailwindcss'
import destr from 'destr'
import { setupNuxtTailwind, r, getVfsFile } from './utils'

type TWConfigWithStringContent<
  C extends Config = Config,
  Content extends C['content'] = C['content'],
  ContentObj extends Extract<Content, { relative?: boolean }> = Extract<Content, { relative?: boolean }>,
  ContentFileType extends ContentObj['files'][number] = string,
> = Omit<C, 'content'> & { content: Omit<ContentObj, 'files'> & { files: Extract<ContentObj['files'][number], ContentFileType>[] } }

describe('tailwindcss module configs', async () => {
  const spyStderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => undefined!)
  const spyStdout = vi.spyOn(process.stdout, 'write').mockImplementation(() => undefined!)

  afterAll(() => {
    spyStderr.mockRestore()
    spyStdout.mockRestore()
  })

  await setupNuxtTailwind({
    exposeConfig: true,
    quiet: false,
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
    // set from ts-tailwind.config.ts
    expect(getVfsFile('test-tailwind.config.cjs')).contains('"typescriptBlue": "#007acc"')
  })

  test('js config file is loaded and merged', () => {
    // set from ts-tailwind.config.ts
    expect(getVfsFile('test-tailwind.config.cjs')).contains('"javascriptYellow": "#f1e05a"')
  })

  test('content is adaptive', () => {
    const { content: { files: contentFiles } } = destr<TWConfigWithStringContent>(getVfsFile('test-tailwind.config.cjs')!.replace(/^(module\.exports = )/, ''))

    expect(contentFiles.find(c => /my-pluggable-modules|my-modular-plugins/.test(c))).toBeDefined()
    expect(contentFiles.filter(c => c.includes('my-imports-dir')).length).toBe(2)
    expect(contentFiles.find(c => c.includes('components/**/*'))?.includes('json,mdc,mdx,coffee')).toBeTruthy()
  })

  test('content is overridden', () => {
    // set from override-tailwind.config.ts
    const { content: { files: contentFiles }} = destr<TWConfigWithStringContent>(getVfsFile('test-tailwind.config.cjs')!.replace(/^(module\.exports = )/, ''))

    expect(contentFiles[0]).toBe('ts-content/**/*.md')
    expect(contentFiles[1]).toBe('./custom-theme/**/*.vue')
    expect(contentFiles.filter(c => /{[AE],[ae]}/.test(c)).length).toBe(0)
  })

  test('content merges with objects', () => {
    const { content } = destr<TWConfigWithStringContent>(getVfsFile('test-tailwind.config.cjs')!.replace(/^(module\.exports = )/, ''))

    expect(content.relative).toBeTruthy()
    expect(content.files.pop()).toBe('./my-components/**/*.tsx')
  })
})