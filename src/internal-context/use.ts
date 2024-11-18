import { getContext } from 'unctx'
import { useNuxt } from '@nuxt/kit'
import { join } from 'pathe'
import _loadConfig from 'tailwindcss/loadConfig.js'
import resolveConfig from 'tailwindcss/resolveConfig.js'
import type { TWConfig } from '../types'

const twCtx = getContext<TWConfig>('twcss')
const { tryUse, set } = twCtx
twCtx.tryUse = () => {
  const ctx = tryUse()

  if (!ctx) {
    try {
      return resolveConfig(_loadConfig(join(useNuxt().options.buildDir, 'tailwind.config.cjs'))) as unknown as TWConfig
    }
    catch { /* empty */ }
  }

  return ctx
}
twCtx.set = (instance, replace = true) => {
  const resolvedConfig = instance && resolveConfig(instance)
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  resolvedConfig && useNuxt().callHook('tailwindcss:resolvedConfig', resolvedConfig, twCtx.tryUse() ?? undefined)

  set(resolvedConfig as unknown as TWConfig, replace)
}

export { twCtx }
