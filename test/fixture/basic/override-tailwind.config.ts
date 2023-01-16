import type { Config } from 'tailwindcss'

type Defaults<T extends string = string> = [
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

type NewConfig = Omit<Config, 'content'> & { content: (Config['content'] | ((contentDefaults: Defaults) => Array<string>)) } // (<T extends string>(srcDir: T, contentDefaults: Defaults<T>) => Array<string>)) }

export default <NewConfig> {
  content: contentDefaults => [
    contentDefaults[0],
    './custom-theme/**/*.vue',
    ...contentDefaults.filter(c => c.endsWith('vue'))
  ],
  theme: {
    extend: {
      colors: {
        typescriptBlue: '#007acc'
      }
    }
  }
}
