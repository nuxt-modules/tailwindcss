import { defineNuxtConfig } from '@nuxt/bridge'
import tailwindModule from '../../..'

export default defineNuxtConfig({
  // bridge: false,
  components: true,
  buildModules: [
    tailwindModule
  ],
  // @ts-ignore
  tailwindcss: {
    exposeConfig: true
  }
})
