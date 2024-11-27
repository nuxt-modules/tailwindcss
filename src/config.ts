import { createDefineConfig } from 'c12'
import type { Config } from 'tailwindcss'

export const defineConfig = createDefineConfig<Partial<Config>>()
export default defineConfig
