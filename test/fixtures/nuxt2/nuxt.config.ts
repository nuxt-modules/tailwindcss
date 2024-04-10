import { defineNuxtConfig } from '@nuxt/bridge'

export default defineNuxtConfig({
  // bridge: false,
  components: true,
  buildModules: [
    '../../..',
  ],
  tailwindcss: {
    exposeConfig: true,
  },
})
