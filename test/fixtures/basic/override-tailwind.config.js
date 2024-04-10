export default {
  content: contentDefaults => [
    contentDefaults[0],
    './custom-theme/**/*.vue',
    ...contentDefaults.filter(c => !/{[AE],[ae]}/.test(c)),
  ],
  theme: {
    extend: {
      colors: {
        typescriptBlue: '#007acc',
      },
    },
  },
}
