import { createDefineConfig } from 'c12'
import { getContext } from 'unctx'
import { tryUseNuxt, requireModule } from '@nuxt/kit'
import type { Config } from 'tailwindcss'

export const ctx = getContext<boolean>('tw-config-ctx')

const _defineConfig = createDefineConfig<Partial<Config>>()
export const defineConfig: typeof _defineConfig = (config) => {
  const isNuxt = !!tryUseNuxt()

  if (isNuxt || ctx.tryUse()) {
    return config
  }

  const nuxtTwConfig = requireModule<Config>('./.nuxt/tailwind/postcss.mjs', { paths: [process.cwd()] })
  return nuxtTwConfig?.default || nuxtTwConfig
}
export default defineConfig
