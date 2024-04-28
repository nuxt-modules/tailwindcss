import type { Config } from 'tailwindcss'

type Extractor = Extract<Config['content'], Record<string, unknown>>['extract']

export const wtfExtractor: Extractor = (content) => {
  return content.match(/[^<>"'`\s]*/g)
}
