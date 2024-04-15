import type { Config } from 'tailwindcss'

export default <Config> {
  content: [
    'ts-content/**/*.md',
  ],
  theme: {
    extend: {
      colors: {
        typescriptBlue: '#007acc',
      },
    },
  },
}
