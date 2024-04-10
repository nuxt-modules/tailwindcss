import type { Config } from 'tailwindcss'

const config: Config = {
  content: {
    relative: true,
    files: ['./my-components/**/*.tsx'],
    extract: {
      jpg: () => ['bg-red'],
    },
  },
}

export default config
