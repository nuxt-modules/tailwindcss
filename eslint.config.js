// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    tooling: true,
    stylistic: true,
  },
  dirs: {
    src: [
      './playground',
      './docs',
    ],
  },
}).append(
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['test/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    files: ['docs/**', 'nuxt2-playground/**'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
)
