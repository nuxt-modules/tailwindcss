// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],
  modules: [
    '@nuxt/content',
    '@nuxt/ui',
    '@nuxtjs/fontaine',
    '@nuxtjs/google-fonts',
    '@nuxtjs/plausible',
    '@nuxthq/studio',
    'nuxt-og-image',
  ],
  // Devtools / Typescript
  devtools: { enabled: true },
  ui: {
    icons: ['heroicons', 'simple-icons', 'ph'],
  },
  alias: {
    '@nuxtjs/tailwindcss': '../src/module',
  },
  routeRules: {
    '/getting-started': { redirect: '/getting-started/installation' },
    '/tailwind': { redirect: '/tailwind/config' },
    '/examples': { redirect: '/examples/basic' },
    '/api/search.json': { prerender: true },
  },
  future: { compatibilityVersion: 4 },

  compatibilityDate: '2024-07-11',
  nitro: {
    prerender: {
      routes: ['/'],
    },
  },
  typescript: { strict: false },
  // Fonts
  fontMetrics: {
    fonts: ['DM Sans'],
  },
  googleFonts: {
    display: 'swap',
    download: true,
    families: {
      'DM+Sans': [400, 500, 600, 700],
    },
  },
})
