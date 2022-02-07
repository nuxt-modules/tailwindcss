// Learn more at https://tailwindcss.com/docs/configuration
export default ({ srcDir }) => ({
  theme: {
    extend: {}
  },
  plugins: [],
  content: [
    `${srcDir}/components/**/*.{vue,js,ts}`,
    `${srcDir}/layouts/**/*.vue`,
    `${srcDir}/pages/**/*.vue`,
    `${srcDir}/plugins/**/*.{js,ts}`,
    `${srcDir}/App.{js,ts,vue}`,
    `${srcDir}/app.{js,ts,vue}`
    // TODO: This makes issues with import protection
    // Split in two files to avoid watching issues (https://github.com/nuxt-community/tailwindcss-module/issues/359)
    // `${rootDir}/nuxt.config.js`,
    // `${rootDir}/nuxt.config.ts`
  ]
})
