module.exports = ({ dev, rootDir, srcDir }) => ({
  theme: {},
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ],
  purge: {
    // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    enabled: !dev,
    content: [
      `${srcDir}/components/**/*.{vue,js}`,
      `${srcDir}/layouts/**/*.vue`,
      `${srcDir}/pages/**/*.vue`,
      `${srcDir}/plugins/**/*.{js,ts}`,
      `${rootDir}/nuxt.config.{js,ts}`
    ]
  }
})
