module.exports = ({ dev, rootDir, srcDir }) => ({
  theme: {},
  variants: {},
  plugins: [],
  purge: {
    // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    enabled: !dev,
    content: [
      `${srcDir}/components/**/*.vue`,
      `${srcDir}/layouts/**/*.vue`,
      `${srcDir}/pages/**/*.vue`,
      `${srcDir}/plugins/**/*.js`,
      `${rootDir}/nuxt.config.js`,
      // TypeScript
      `${srcDir}/plugins/**/*.ts`,
      `${rootDir}/nuxt.config.ts`
    ]
  }
})
