import { $fetch } from '@nuxt/test-utils'
import { describe, test, expect } from 'vitest'
import { r, setupNuxtTailwind } from './utils'
import { existsSync } from 'node:fs'

const fixturePath = r('', 'nuxt-website')

describe.skipIf(!existsSync(fixturePath))('tailwindcss module', async () => {
  await setupNuxtTailwind({}, {}, {}, fixturePath)

  test('homepage is same', async () => {
    const searchText = '| https://tailwindcss.com*/'
    const html: string = await $fetch('/')
    const _styles = html.slice(html.indexOf(searchText) + searchText.length)
    const styles = html.slice(0, _styles.indexOf('</style>'))

    // console.log(html.indexOf(searchText), styles)
    const expectedHtml: string = await $fetch('/', { baseURL: 'https://nuxt.com' })
    // // console.log(html);
    // expect(html).contains("tailwind")
    // expect(expectedHtml).contains("tailwind")
    expect(html).toBe(expectedHtml)
  })
})
