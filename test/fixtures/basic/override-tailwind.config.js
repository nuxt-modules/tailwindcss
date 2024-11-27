export default {
  content: contentDefaults => [
    contentDefaults?.[0],
    './custom-theme/**/*.vue',
    ...(contentDefaults || []).filter(c => (c.includes('coffee') || c.includes('my-')) && !/\{[AE],[ae]\}/.test(c)),
  ],
  theme: {
    extend: {
      colors: {
        typescriptBlue: '#007acc',
      },
    },
  },
}
