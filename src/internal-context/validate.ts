import type { TWConfig } from '../types'

export const checkUnsafeInlineConfig = <T extends Partial<TWConfig>>(inlineConfig: T | undefined) => {
  if (!inlineConfig) return

  if (
    'plugins' in inlineConfig && Array.isArray(inlineConfig.plugins)
    && inlineConfig.plugins.find(p => typeof p === 'function' || typeof p?.handler === 'function')
  ) {
    return 'plugins'
  }

  if (inlineConfig.content) {
    // @ts-expect-error indexing content with different possibilities
    const invalidProperty = ['extract', 'transform'].find(i => i in inlineConfig.content! && typeof inlineConfig.content![i] === 'function')

    if (invalidProperty) {
      return `content.${invalidProperty}`
    }
  }

  if (inlineConfig.safelist) {
    const invalidIdx = inlineConfig.safelist.findIndex(s => typeof s === 'object' && s.pattern instanceof RegExp)

    if (invalidIdx > -1) {
      return `safelist[${invalidIdx}]`
    }
  }
}
