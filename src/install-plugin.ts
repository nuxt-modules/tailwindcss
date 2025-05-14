import { useNuxt, addVitePlugin } from '@nuxt/kit'

export default async function installPlugin(nuxt = useNuxt()) {
  if (nuxt.options.builder === '@nuxt/vite-builder') {
    const existsTailwindPlugin = (plugins = nuxt.options.vite.plugins): boolean => !!plugins?.some((plugin) => {
      if (Array.isArray(plugin)) {
        return existsTailwindPlugin(plugin)
      }

      return plugin && 'name' in plugin && plugin.name.startsWith('@tailwindcss/vite')
    })

    if (!existsTailwindPlugin()) {
      await import('@tailwindcss/vite').then(r => addVitePlugin(r.default()))
    }
  }
  else {
    nuxt.options.postcss ??= { plugins: {}, order: [] }
    nuxt.options.postcss.plugins ??= {}

    if (!nuxt.options.postcss.plugins['@tailwindcss/postcss']) {
      nuxt.options.postcss.plugins['@tailwindcss/postcss'] = {}
    }
  }
}
