import { defineNuxtConfig } from 'nuxt'
import tailwindModule from '../src/module'

export default defineNuxtConfig({
  extends: ['./theme'],
  modules: [
    '@nuxt/content',
    tailwindModule
  ],
  tailwindcss: {
    exposeConfig: true,
    configPath: './tailwind.config.js'
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
