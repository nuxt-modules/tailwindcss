import { defineNuxtModule, addTemplate } from '@nuxt/kit'

export default defineNuxtModule({
  setup (_options, nuxt) {
    // logger.info('Creating test-tailwind.config.cjs...')

    nuxt.hook('tailwindcss:resolvedConfig', (config) => {
      addTemplate({
        filename: 'test-tailwind.config.cjs', // gets prepended by .nuxt/
        getContents: () => `module.exports = ${JSON.stringify(config, null, 2)}`,
        write: true
      })
    })
  }
})
