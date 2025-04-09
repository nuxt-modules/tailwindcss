import { fileURLToPath } from 'node:url'
import { resolve } from 'pathe'
import { createDefineConfig } from 'c12'
import { tryUseNuxt, requireModule } from '@nuxt/kit'
import type { Config } from 'tailwindcss'

const pathToThisFile = resolve(fileURLToPath(import.meta.url))
const pathPassedToNode = resolve(process.argv[1])
const isMainFile = pathToThisFile.includes(pathPassedToNode)

const _defineConfig = createDefineConfig<Partial<Config>>()
export const defineConfig: typeof _defineConfig = (config) => {
  const isNuxt = !!tryUseNuxt()
  return isNuxt ? config : isMainFile ? requireModule('.nuxt/tailwind/postcss.mjs') : config
}
export default defineConfig
