import { defineNuxtConfig } from 'nuxt'
import tailwindModule from '..'

export default defineNuxtConfig({
  buildModules: [
    tailwindModule
  ],
  tailwindcss: {
    exposeConfig: true
  }
})
