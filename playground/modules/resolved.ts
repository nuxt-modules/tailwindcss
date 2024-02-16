import { defineNuxtModule, addTemplate } from '@nuxt/kit'

export default defineNuxtModule((_, nuxt) => {
    nuxt.hook('tailwindcss:resolvedConfig', (config) =>
        addTemplate({
            filename: 'resolved-config.cjs',
            getContents: () => `module.exports = ${JSON.stringify(config, null, 2)}`,
            write: true
        })
    )
})
