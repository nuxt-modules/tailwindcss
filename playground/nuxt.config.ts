import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  css: [
    '~/assets/css/main.css',
    '~/assets/css/test.css',
  ],
  future: {
    compatibilityVersion: 4,
  },
})
