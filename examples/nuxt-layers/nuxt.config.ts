export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: [
    '@nuxt/examples-ui',
    './local-layer',
    'content-wind'
  ],
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    'nuxt-icon',
    '@nuxthq/studio'
  ],
  tailwindcss: { exposeConfig: true }
})
