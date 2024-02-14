import { existsSync } from 'node:fs'
import { resolve } from 'pathe'
import { consola } from 'consola'
import type { ModuleHooks, ModuleOptions } from '../src/types'

const logger = consola.withTag('nuxt:tailwindcss:playground')

export default defineNuxtConfig({
  extends: ['./theme'],
  modules: [
    '@nuxt/content',
    existsSync(resolve(__dirname, '../dist/module.mjs')) ? '@nuxtjs/tailwindcss' : '../src/module',
    '@nuxt/devtools'
  ],
  tailwindcss: {
    // viewer: false,
    exposeConfig: true,
    cssPath: '~/assets/css/tailwind.css',
    editorSupport: true
  } satisfies Partial<ModuleOptions>,
  hooks: {
    'tailwindcss:loadConfig': (config, configPath, idx) => {
      logger.info('Running `tailwindcss:loadConfig` hook...', { configPath, idx })

      if (idx === 0 && config) {
        config.theme = config.theme ?? {}
        config.theme.extend = config.theme.extend ?? {}
        config.theme.extend.screens = { md2: '100px' }
      } else if (idx === 1 && config) {
        config.content = config.content ?? []
        Array.isArray(config.content) ? config.content.push('my-content') : config.content.files.push('my-file-content')
      }
    },
    'tailwindcss:config': (config) => {
      logger.info('Running `tailwindcss:config` hook...')

      config.theme = config.theme ?? {}
      config.theme.extend = config.theme.extend ?? {}
      config.theme.extend.colors = config.theme.extend.colors ?? {}
      // @ts-ignore
      config.theme.extend.colors.extendedColor = '#f0ff0f'
    },
    'tailwindcss:resolvedConfig': (_config) => {
      logger.info('Running `tailwindcss:resolvedConfig` hook...')
    }
  } satisfies Partial<ModuleHooks>,
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
