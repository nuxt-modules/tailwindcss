import { readFile } from 'node:fs/promises'
import { useNuxt, resolvePath, addTemplate } from '@nuxt/kit'
import { join } from 'pathe'

const IMPORT_REGEX = /^@import ["']tailwindcss["']/gm

const getDefaults = (nuxt = useNuxt()) => [
  'css/tailwind.css', 'css/main.css', 'css/styles.css',
].map(defaultPath => join(nuxt.options.srcDir, nuxt.options.dir.assets, defaultPath))

export default async function importCSS(nuxt = useNuxt()) {
  const defaultCSSFiles = getDefaults(nuxt)
  const resolvedCSSFiles = await Promise.all(nuxt.options.css.map(p => resolvePath(p))).then(arr => arr.reverse())

  const analyzedFiles = await Promise.all([...new Set([...resolvedCSSFiles, ...defaultCSSFiles])].map(async (file) => {
    const fileContents = await readFile(file, { encoding: 'utf-8' }).catch(() => '')
    return [file, { hasImport: IMPORT_REGEX.test(fileContents), isInNuxt: resolvedCSSFiles.includes(file) }] as const
  }))

  const filesImportingTailwind = analyzedFiles.filter(file => file[1].hasImport)

  const [file, { isInNuxt } = {}] = filesImportingTailwind.length === 0
    ? [addTemplate({ filename: 'tailwind.css', getContents: () => `@import 'tailwindcss';`, write: true }).dst]
    : filesImportingTailwind.find(file => file[1].isInNuxt) || filesImportingTailwind.pop()!

  if (!isInNuxt) {
    nuxt.options.css.push(file)
  }

  nuxt.options.alias['#tailwind'] = file
}
