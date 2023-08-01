import { fileURLToPath } from 'node:url'
import { setup } from '@nuxt/test-utils'
import { joinURL } from 'ufo'

export const r = (s: string = '') => fileURLToPath(new URL(joinURL('./fixture/basic', s), import.meta.url))

export const setupNuxtTailwind = (tailwindcss = {}) => {
  return setup({
    rootDir: r(),
    server: true,
    browser: false,
    nuxtConfig: {
      tailwindcss
    }
  })
}
