/* eslint-disable spaced-comment */
/// <reference types="vitest" />
/// <reference types="vitest/globals" />

import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@nuxtjs/tailwindcss': resolve(__dirname, 'src/module.ts')
    }
  },
  define: {
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false'
  },
  test: {
    globals: true,
    environment: 'jsdom',
    reporters: 'dot'
  }
})
