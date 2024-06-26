import { describe, test, expect, vi, afterAll } from 'vitest'
import type { Config } from 'tailwindcss'
import destr from 'destr'
import loadConfig from 'tailwindcss/loadConfig'
import { useTestContext } from '@nuxt/test-utils'
import { join } from 'pathe'
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
      'content-obj.config',
    ],
    cssPath: 'tailwind.css',
  },
  {
    dir: { plugins: 'my-pluggable-modules', modules: 'my-modular-plugins' },
    modules: [r('modules/cjs-config.ts'), '@nuxtjs/tailwindcss'],
    imports: { dirs: ['my-imports-dir1', 'my-imports-dir2'] },
    extensions: ['.json', '.mdc', '.mdx', '.coffee'],
    hooks: {
      'tailwindcss:config': (tailwindConfig) => {
        tailwindConfig.content = tailwindConfig.content ?? []

        if (Array.isArray(tailwindConfig.content)) {
          tailwindConfig.content.push('my-custom-content')
        }
        else {
          tailwindConfig.content.files = tailwindConfig.content.files ?? []
          tailwindConfig.content.files.push('my-custom-content')
        }
      },
    },
  })

  test('throws error about malformed config', () => {
    expect(spyStderr).toBeCalledTimes(1)
    const output = spyStderr.mock.calls[0][0].toString()

    expect(output.split('\n')[0]).toMatchInlineSnapshot('"[warn] [nuxt:tailwindcss] Failed to load config `./malformed-tailwind.config.js` due to the error below. Skipping.."')
    expect(output).contains('Failed to load Tailwind config at: `./malformed-tailwind.config.js`')
  })

  test('ts config file is loaded and merged', () => {
    // set from ts-tailwind.config.ts
    expect(getVfsFile('test-tailwind.config.mjs')).contains('"typescriptBlue": "#007acc"')
  })

  test('js config file is loaded and merged', () => {
    // set from ts-tailwind.config.ts
    expect(getVfsFile('test-tailwind.config.mjs')).contains('"javascriptYellow": "#f1e05a"')
  })

  test('content is adaptive', () => {
    const { content: { files: contentFiles } } = destr<TWConfigWithStringContent>(getVfsFile('test-tailwind.config.mjs')!.replace(/^export default /, ''))

    expect(contentFiles.find(c => /my-pluggable-modules|my-modular-plugins/.test(c))).toBeDefined()
    expect(contentFiles.filter(c => c.includes('my-imports-dir')).length).toBe(2)
    expect(contentFiles.find(c => c.includes('components/**/*'))?.includes('json,mdc,mdx,coffee')).toBeTruthy()
  })

  test('content is overridden', () => {
    // set from override-tailwind.config.ts
    const { content: { files: contentFiles } } = destr<TWConfigWithStringContent>(getVfsFile('test-tailwind.config.mjs')!.replace(/^export default /, ''))

    expect(contentFiles[0]).toBe('ts-content/**/*.md')
    expect(contentFiles[1]).toBe('./custom-theme/**/*.vue')
    expect(contentFiles.filter(c => /{[AE],[ae]}/.test(c)).length).toBe(0)
    expect([...contentFiles].pop()).toBe('my-custom-content')
  })

  test('content merges with objects', () => {
    const { content } = destr<TWConfigWithStringContent>(getVfsFile('test-tailwind.config.mjs')!.replace(/^export default /, ''))

    expect(content.relative).toBeTruthy()
    expect(content.files.includes('./my-components/**/*.tsx')).toBe(true)
  })

  test('config template compiled properly', () => {
    const configFile = getVfsFile('tailwind.config.cjs')
    const loadedConfig = loadConfig(join(useTestContext().nuxt!.options.buildDir, 'tailwind.config.cjs'))
    expect(configFile).contains(`module.exports = (() => {const cfg=config;cfg["content"]${'files' in loadedConfig.content ? `["files"]["${loadedConfig.content.files.length - 1}"]` : `["${loadedConfig.content.length - 1}"]`} = "my-custom-content";;return cfg;})()`)
  })
})
