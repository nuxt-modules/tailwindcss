import { defineNuxtConfig } from 'nuxt/config'
import { consola } from 'consola'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import typography from '@tailwindcss/typography'

import type { ModuleHooks, ModuleOptions } from '../src/types'

const logger = consola.withTag('nuxt:tailwindcss:playground')

export default defineNuxtConfig({
  extends: ['./theme'],
  // ssr: false,

  // builder: 'webpack',
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
  ],

  css: [
    // Including Inter CSS is the first component to reproduce HMR issue. It also causes playground to look better,
    // since Inter is a native font for Tailwind UI
    '@fontsource/inter/400.css',
    '@fontsource/inter/500.css',
    '@fontsource/inter/600.css',
    '@fontsource/inter/700.css',
  ],

  content: {
    documentDriven: true,
  },

  compatibilityDate: '2024-07-11',

  hooks: {
    'tailwindcss:loadConfig': (config, configPath, idx) => {
      logger.info('Running `tailwindcss:loadConfig` hook...', Object.keys(config || {}), { configPath, idx })

      if (idx === 0 && config) {
        config.theme = config.theme ?? {}
        config.theme.extend = config.theme.extend ?? {}
        config.theme.extend.screens = { md2: '100px' }
        config.theme.extend.colors = config.theme.extend.colors ?? {}
        // @ts-expect-error TODO: types for colors are not correct
        config.theme.extend.colors.zeroLayer = '#0fe325'
      }
      else if (idx === 1 && config) {
        config.content = config.content ?? []

        if (Array.isArray(config.content))
          config.content.push('my-content')
        else
          config.content.files.push('my-file-content')
      }
    },
    'tailwindcss:config': (config) => {
      logger.info('Running `tailwindcss:config` hook...')

      config.theme = config.theme ?? {}
      config.theme.extend = config.theme.extend ?? {}
      config.theme.extend.colors = config.theme.extend.colors ?? {}
      // @ts-expect-error TODO: types for colors are not correct
      config.theme.extend.colors.twConfig = '#f0ff0f'
    },
    'tailwindcss:resolvedConfig': (config, oldConfig) => {
      // @ts-expect-error TODO: types for theme are not correct
      logger.info('Running `tailwindcss:resolvedConfig` hook...', {
        typography: Boolean(config.theme.typography),
        hasOld: Boolean(oldConfig),
      })
    },
  } satisfies Partial<ModuleHooks>,

  tailwindcss: {
    // viewer: false,
    config: {},
    exposeConfig: true,
    cssPath: '~/assets/css/tailwind.css',
    editorSupport: true,
  } satisfies Partial<ModuleOptions>,
})
