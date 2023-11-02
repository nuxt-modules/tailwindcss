import { fileURLToPath } from 'node:url'
import { setup } from '@nuxt/test-utils'
import { NuxtConfig } from '@nuxt/schema'
import { ModuleOptions } from '../src/module'

export const r = (s: string = '') => fileURLToPath(new URL('./fixtures/basic/' + s, import.meta.url))

export const setupNuxtTailwind = (tailwindcss: Partial<ModuleOptions> = {}, nuxtConfig: NuxtConfig = {}) => {
  return setup({
    rootDir: r(),
    server: true,
    browser: false,
    nuxtConfig: {
      ...nuxtConfig,
      tailwindcss
    }
  })
}
