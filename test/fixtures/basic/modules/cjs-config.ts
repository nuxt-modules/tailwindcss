import { defineNuxtModule, addTemplate } from '@nuxt/kit'

export default defineNuxtModule({
  setup (_options, nuxt) {
    // logger.info('Creating test-tailwind.config.mjs...')

    nuxt.hook('tailwindcss:resolvedConfig', (config) => {
      addTemplate({
        filename: 'test-tailwind.config.mjs', // gets prepended by .nuxt/
        getContents: () => `export default ${JSON.stringify(config, null, 2)}`,
        write: true
      })
    })
  }
})
