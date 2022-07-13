import { fileURLToPath } from 'url'
import { defineNuxtConfig } from 'nuxt'
import { resolve } from 'pathe'
import tailwindModule from '../../src/module'

const themeDir = fileURLToPath(new URL('./', import.meta.url))
const resolveThemeDir = (path: string) => resolve(themeDir, path)

export default defineNuxtConfig({
  modules: [tailwindModule],

  tailwindcss: {
    configPath: resolveThemeDir('./tailwind.config.js')
  }
})
