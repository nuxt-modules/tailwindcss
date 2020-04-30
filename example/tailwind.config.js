/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/
module.exports = {
  theme: {},
  variants: {},
  plugins: [],
  purge: {
    // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    enabled: process.env.NODE_ENV === 'production',
    // We prefixed with `example/` here since we run `nuxt example/` and working dir is '../' for PurgeCSS
    content: [
      'example/components/**/*.vue',
      'example/layouts/**/*.vue',
      'example/pages/**/*.vue',
      'example/plugins/**/*.js',
      'example/nuxt.config.js'
    ]
  }
}
