import { defineNuxtModule, addTemplate } from '@nuxt/kit'

export default defineNuxtModule((_, nuxt) => {
  const template = addTemplate({
    filename: 'my-tw-config.cjs',
    write: true,
    getContents: () => `
    const colors = require('tailwindcss/colors')

    module.exports = {
      theme: {
        extend: {
          colors: {
            accent: colors.slate['500']
          }
        }
      }
    }
    `,
  })

  nuxt.options.tailwindcss = nuxt.options.tailwindcss ?? {}
  if (!Array.isArray(nuxt.options.tailwindcss.configPath)) {
    nuxt.options.tailwindcss.configPath = nuxt.options.tailwindcss.configPath ? [nuxt.options.tailwindcss.configPath] : []
  }
  nuxt.options.tailwindcss.configPath.push(template.dst)
})
