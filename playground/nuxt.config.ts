import { defineNuxtConfig } from 'nuxt3'
import tailwindModule from '..'

export default defineNuxtConfig({
  // vite: false,
  buildModules: [
    tailwindModule
  ],
  tailwindcss: {
    exposeConfig: true
  }
})
