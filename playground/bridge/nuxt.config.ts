import { defineNuxtConfig } from '@nuxt/bridge'
import tailwindModule from '../../src'

export default defineNuxtConfig({
  buildModules: [tailwindModule],
  components: true,
  tailwindcss: {
    exposeConfig: true
  }
})
