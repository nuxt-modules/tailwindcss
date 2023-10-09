export default {
  content: contentDefaults => [
    contentDefaults[0],
    './custom-theme/**/*.vue',
    ...contentDefaults.filter(c => c.includes('vue'))
  ],
  theme: {
    extend: {
      colors: {
        typescriptBlue: '#007acc'
      }
    }
  }
}
