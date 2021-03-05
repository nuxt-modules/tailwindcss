// Learn more at https://tailwindcss.com/docs/configuration
module.exports = ({ dev, rootDir, srcDir }) => ({
  purge: [
    `${srcDir}/components/**/*.{vue,js}`,
    `${srcDir}/layouts/**/*.vue`,
    `${srcDir}/pages/**/*.vue`,
    `${srcDir}/plugins/**/*.{js,ts}`,
    `${rootDir}/nuxt.config.{js,ts}`
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {}
  },
  variants: {
    extend: {}
  },
  plugins: []
})
