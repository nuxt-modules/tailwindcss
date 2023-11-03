import { fileURLToPath } from 'node:url'
import { setup, type TestOptions } from '@nuxt/test-utils'
import type { NuxtConfig } from '@nuxt/schema'
import type { ModuleOptions } from '../src/module'

export const r = (s = '', fixture = 'basic') => fileURLToPath(new URL(`./fixtures/${fixture}/` + s, import.meta.url))

export const setupNuxtTailwind = (tailwindcss: Partial<ModuleOptions> = {}, nuxtConfig: NuxtConfig = {}, testOptions: Partial<TestOptions> = {}, fixture = '') => {
  return setup({
    rootDir: fixture || r(),
    server: true,
    browser: false,
    ...testOptions,
    nuxtConfig: {
      ...nuxtConfig,
      tailwindcss
    }
  })
}
