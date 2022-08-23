import { resolve } from 'path'
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  alias: {
    '@nuxtjs/tailwindcss': resolve(__dirname, '../../../src/module.ts')
  },
  modules: [
    '@nuxtjs/tailwindcss'
  ]
})
