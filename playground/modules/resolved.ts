import { defineNuxtModule, addTemplate, updateTemplates } from '@nuxt/kit'
// import { resolve } from 'pathe'
// import loadConfig from 'tailwindcss/loadConfig.js'
// import resolveConfig from 'tailwindcss/resolveConfig.js'

export default defineNuxtModule({
  setup(_options, nuxt) {
    // logger.info('Creating test-tailwind.config.cjs...')
    let counter = 1

    nuxt.hook('tailwindcss:resolvedConfig', (config, oldConfig) =>
      oldConfig
        ? setTimeout(() => updateTemplates({ filter: t => t.filename === 'resolved-config.cjs' }), 100)
        : addTemplate({
          filename: 'resolved-config.cjs',
          getContents: () => `module.exports = /* ${counter++}, ${Boolean(oldConfig)} */ ${JSON.stringify(config, null, 2)}`,
          write: true,
        }),
    )

    // const template = addTemplate({
    //   filename: 'resolved-config.config.cjs', // gets prepended by .nuxt/
    //   getContents: ({ nuxt }) => {
    //     const config = loadConfig(resolve(nuxt.options.buildDir, 'tailwind.config.cjs'))
    //     return `module.exports = ${JSON.stringify(resolveConfig(config), null, 2)}`
    //   },
    //   write: true
    // })

    // nuxt.hook('app:templatesGenerated', (_app, templates) => {
    //   templates.map(t => t.dst).includes(resolve(nuxt.options.buildDir, 'tailwind.config.cjs')) && updateTemplates({ filter: t => t.dst === template.dst })
    // })
  },
})
