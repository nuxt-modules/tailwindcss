import { resolve } from 'node:path'

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  alias: {
    '@nuxtjs/tailwindcss': resolve(__dirname, '../../../src/module.ts'),
  },
})
