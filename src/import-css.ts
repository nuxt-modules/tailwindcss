import { readFile } from 'node:fs/promises'
import { resolveModulePath } from 'exsolve'
import { useNuxt, resolvePath, addTemplate, logger } from '@nuxt/kit'
import type { NuxtConfig } from 'nuxt/schema'
import { join } from 'pathe'

// eslint-disable-next-line
const IMPORT_REGEX = /(?<=\s|^|;|\})@import\s+["']tailwindcss["']/gmu

const getDefaults = (nuxtConfig: NuxtConfig & { srcDir: string }) => [
  'css/tailwind.css', 'css/main.css', 'css/styles.css',
].map(defaultPath => join(nuxtConfig.srcDir, nuxtConfig.dir?.assets || 'assets', defaultPath))

export default async function importCSS(nuxt = useNuxt()) {
  const sources = nuxt.options._layers.map(layer => ({ type: 'path', source: layer.config.srcDir || layer.cwd }))

  // Add variables from Nuxt config that need parsing
  const sourceConfigs = [
    nuxt.options.app?.head?.htmlAttrs?.class,
    nuxt.options.app?.head?.bodyAttrs?.class,
  ]
  sourceConfigs.forEach((value) => {
    if (value && typeof value === 'string') sources.push({ type: 'inline', source: value })
  })

  await nuxt.callHook('tailwindcss:sources:extend', sources)

  const sourcesTemplate = addTemplate({
    filename: 'tailwindcss/sources.css',
    getContents: () => sources.map(s => `@source ${s.type === 'path' ? JSON.stringify(s.source) : `${s.type}(${s.source})`};`).join('\n'),
    write: true,
  })

  const filesImportingTailwind: (readonly [string, { isInNuxt: boolean }])[] = []
  const projectCSSFiles = await Promise.all(nuxt.options.css.map(p => resolvePath(p)))

  for (let i = 0; i < nuxt.options._layers.length; i++) {
    const layer = nuxt.options._layers[i]
    const resolvedCSSFiles: string[] = []

    if (i === 0) {
      resolvedCSSFiles.push(...projectCSSFiles)
    }
    else if (layer.config.css) {
      await Promise.all(layer.config.css.filter(p => typeof p === 'string').map(p => resolvePath(p))).then(files => resolvedCSSFiles.push(...files))
    }

    const analyzedFiles = await Promise.all([...new Set([...getDefaults(layer.config), ...resolvedCSSFiles])].map(async (file) => {
      const fileContents = await readFile(file, { encoding: 'utf-8' }).catch(() => '')
      return [file, { hasImport: IMPORT_REGEX.test(fileContents), isInNuxt: projectCSSFiles.includes(file) }] as const
    })).then(files => files.filter(file => file[1].hasImport))

    if (analyzedFiles.length) {
      filesImportingTailwind.push(...analyzedFiles)
      break
    }
  }

  const tailwindPath = resolveModulePath('tailwindcss', { from: import.meta.url, conditions: ['style'] })
  const [file, { isInNuxt } = {}] = filesImportingTailwind.length === 0
    ? [
        addTemplate({
          filename: 'tailwind.css',
          getContents: () => [`@import ${JSON.stringify(tailwindPath)};`, `@import ${JSON.stringify(sourcesTemplate.dst)};`].join('\n'),
          write: true,
        }).dst,
      ]
    : filesImportingTailwind.find(file => file[1].isInNuxt) || filesImportingTailwind.pop()!

  if (!isInNuxt) {
    nuxt.options.css.unshift(file)
  }

  nuxt.options.alias['#tailwindcss'] = file
  nuxt.options.alias['#tailwindcss/sources'] = sourcesTemplate.dst

  nuxt.hook('builder:watch', (_e, path) => {
    if (path !== file && projectCSSFiles.includes(path)) {
      readFile(file, { encoding: 'utf-8' }).then((fileContents) => {
        if (IMPORT_REGEX.test(fileContents)) {
          logger.withTag('@nuxtjs/tailwindcss').warn(`New import for \`tailwindcss\` detected in ${file}. Restart server.`)
        }
      })
    }
  })
}
