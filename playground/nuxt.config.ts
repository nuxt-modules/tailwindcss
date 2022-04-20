import { defineNuxtConfig } from 'nuxt3'
import tailwindModule from '../src/module'

export default defineNuxtConfig({
  // vite: false,
  buildModules: [
    tailwindModule
  ],
  tailwindcss: {
    exposeConfig: true
  }
})
