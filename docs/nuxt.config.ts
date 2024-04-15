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
  ui: {
    icons: ['heroicons', 'simple-icons', 'ph'],
  },
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
  routeRules: {
    '/getting-started': { redirect: '/getting-started/installation' },
    '/tailwind': { redirect: '/tailwind/config' },
    '/examples': { redirect: '/examples/basic' },
    '/api/search.json': { prerender: true },
  },
  // Devtools / Typescript
  devtools: { enabled: true },
  typescript: { strict: false },
  alias: {
    '@nuxtjs/tailwindcss': '../src/module',
  },
})
