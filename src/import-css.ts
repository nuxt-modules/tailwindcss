import { readFile } from 'node:fs/promises'
import { useNuxt, resolvePath, addTemplate } from '@nuxt/kit'
import type { NuxtConfig } from 'nuxt/schema'
import { join } from 'pathe'

// eslint-disable-next-line
const IMPORT_REGEX = /(?<=\s|^|;|\})@import\s+["']tailwindcss["']/gmu

const getDefaults = (nuxtConfig: NuxtConfig & { srcDir: string }) => [
  'css/tailwind.css', 'css/main.css', 'css/styles.css',
].map(defaultPath => join(nuxtConfig.srcDir, nuxtConfig.dir?.assets || 'assets', defaultPath))

export default async function importCSS(nuxt = useNuxt()) {
  const sources = nuxt.options._layers.map(layer => layer.config.srcDir || layer.cwd)
  await nuxt.callHook('tailwindcss:sources:extend', sources)

  const sourcesTemplate = addTemplate({
    filename: 'tailwindcss/sources.css',
    getContents: () => sources.map(source => `@source ${JSON.stringify(source)};`).join('\n'),
    write: true,
  })

  const filesImportingTailwind: (readonly [string, { isInNuxt: boolean }])[] = []

  for (const layer of nuxt.options._layers) {
    const defaultCSSFiles = getDefaults(layer.config)
    const resolvedCSSFiles = layer.config.css ? await Promise.all(layer.config.css.filter(p => typeof p === 'string').map(p => resolvePath(p))) : []

    const analyzedFiles = await Promise.all([...new Set([...defaultCSSFiles, ...resolvedCSSFiles])].map(async (file) => {
      const fileContents = await readFile(file, { encoding: 'utf-8' }).catch(() => '')
      return [file, { hasImport: IMPORT_REGEX.test(fileContents), isInNuxt: resolvedCSSFiles.includes(file) }] as const
    })).then(files => files.filter(file => file[1].hasImport))

    if (analyzedFiles.length) {
      filesImportingTailwind.push(...analyzedFiles)
      break
    }
  }

  const [file, { isInNuxt } = {}] = filesImportingTailwind.length === 0
    ? [
        addTemplate({
          filename: 'tailwind.css',
          getContents: () => [`@import 'tailwindcss';`, `@import ${JSON.stringify(sourcesTemplate.dst)};`].join('\n'),
          write: true,
        }).dst,
      ]
    : filesImportingTailwind.find(file => file[1].isInNuxt) || filesImportingTailwind.pop()!

  if (!isInNuxt) {
    nuxt.options.css.unshift(file)
  }

  nuxt.options.alias['#tailwindcss'] = file
  nuxt.options.alias['#tailwindcss/sources'] = sourcesTemplate.dst
}
