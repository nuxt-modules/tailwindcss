import { Config } from 'tailwindcss'

export default <Config> {
  content: [
    'content/**/*.md'
  ],
  theme: {
    extend: {
      colors: {
        typescriptBlue: '#007acc'
      }
    }
  }
}
