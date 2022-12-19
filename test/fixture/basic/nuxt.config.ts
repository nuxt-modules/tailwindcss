import { resolve } from 'path'

export default defineNuxtConfig({
  alias: {
    '@nuxtjs/tailwindcss': resolve(__dirname, '../../../src/module.ts')
  },
  modules: [
    '@nuxtjs/tailwindcss'
  ]
})
