import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, useTestContext } from '@nuxt/test-utils/e2e'

describe('@nuxtjs/tailwindcss', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixture', import.meta.url)),
  })

  it('installs tailwindcss', async () => {
    const { nuxt } = useTestContext()

    if (!nuxt) {
      throw new Error('Nuxt not defined')
    }

    // expect(JSON.stringify(nuxt.options.vite.plugins)).contains('@tailwindcss/vite')
    expect(nuxt.options.alias['#tailwindcss']).contains('tailwind.css')
  })
})
