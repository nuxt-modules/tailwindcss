// Learn more at https://tailwindcss.com/docs/configuration
import { Config } from 'tailwindcss'

export default (): Config => ({
  theme: {
    extend: {}
  },
  plugins: [],
  content: [
    // TODO: This makes issues with import protection
    // Split in two files to avoid watching issues (https://github.com/nuxt-community/tailwindcss-module/issues/359)
    // `${rootDir}/nuxt.config.js`,
    // `${rootDir}/nuxt.config.ts`
  ]
})
