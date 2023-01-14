import type { Config } from 'tailwindcss'

type Defaults<T extends string> = [
  `${T}/components/**/*.{vue,js,ts}`,
  `${T}/layouts/**/*.vue`,
  `${T}/pages/**/*.vue`,
  `${T}/composables/**/*.{js,ts}`,
  `${T}/plugins/**/*.{js,ts}`,
  `${T}/App.{js,ts,vue}`,
  `${T}/app.{js,ts,vue}`,
  `${T}/Error.{js,ts,vue}`,
  `${T}/error.{js,ts,vue}`
]

type NewConfig = Omit<Config, 'content'> & { content: (Config['content'] | (<T extends string>(srcDir: T, contentDefaults: Defaults<T>) => Array<string>)) }

export default <NewConfig> {
  content: (srcDir, contentDefaults) => [
    contentDefaults[0],
    `${srcDir}/theme1/**/*.vue`,
    './theme2/**/*.vue'
  ],
  theme: {
    extend: {
      colors: {
        typescriptBlue: '#007acc'
      }
    }
  }
}
