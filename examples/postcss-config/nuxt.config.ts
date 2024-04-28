export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  postcss: {
    plugins: {
      'postcss-color-gray': {}
    }
  },
  tailwindcss: { exposeConfig: true }
})
