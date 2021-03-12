// Learn more at https://tailwindcss.com/docs/configuration
export default ({ _dev, rootDir, srcDir }) => ({
  purge: {
    content: [
      `${srcDir}/components/**/*.{vue,js}`,
      `${srcDir}/layouts/**/*.vue`,
      `${srcDir}/pages/**/*.vue`,
      `${srcDir}/plugins/**/*.{js,ts}`,
      `${rootDir}/nuxt.config.{js,ts}`
    ],
    // https://tailwindcss.com/docs/optimizing-for-production#purge-css-options
    options: {}
  },
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
})
