export default defineNuxtConfig({
  extends: ['./theme'],
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxt/devtools'
  ],
  tailwindcss: {
    // viewer: false,
    exposeConfig: true,
    cssPath: ['~/assets/css/tailwind.css', { injectPosition: 'last' }],
    editorSupport: true
  },
  content: {
    documentDriven: true
  },
  css: [
    // Including Inter CSS is the first component to reproduce HMR issue. It also causes playground to look better,
    // since Inter is a native font for Tailwind UI
    '@fontsource/inter/400.css',
    '@fontsource/inter/500.css',
    '@fontsource/inter/600.css',
    '@fontsource/inter/700.css'
  ]
})
