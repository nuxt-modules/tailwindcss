import { fileURLToPath } from 'node:url'
import { setup, useTestContext, type TestOptions } from '@nuxt/test-utils'
import type { NuxtConfig } from '@nuxt/schema'
import type { ModuleOptions } from '../src/module'

export const r = (s = '', fixture = 'basic') => fileURLToPath(new URL(`./fixtures/${fixture}/` + s, import.meta.url))

export const setupNuxtTailwind = (
  tailwindcss: Partial<ModuleOptions> = {},
  nuxtConfig: NuxtConfig = {},
  testOptions: Partial<TestOptions> = {},
  fixture = ''
) => {
  return setup({
    rootDir: fixture || r(),
    server: true,
    browser: false,
    ...testOptions,
    nuxtConfig: {
      ...nuxtConfig,
      // @ts-ignore
      tailwindcss
    }
  })
}

export const getVfsFile = (name: string) => {
  const nuxt = useTestContext().nuxt
  const key = nuxt && Object.keys(nuxt.vfs).find(k => k.endsWith(name))
  return key && nuxt.vfs[key]
}
