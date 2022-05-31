import { defineNuxtConfig } from 'nuxt'
import colors from 'tailwindcss/colors.js'

export default defineNuxtConfig({
  extends: ['./node_modules/@docus/docs-theme'],
  github: {
    owner: 'nuxt-community',
    repo: 'tailwindcss-module',
    branch: 'main'
  },
  modules: ['@nuxthq/admin', '@docus/github', 'vue-plausible'],
  plausible: {
    domain: 'tailwindcss.nuxtjs.org'
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            primary: colors.sky
          }
        }
      }
    }
  }
})
