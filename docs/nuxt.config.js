import { withDocus } from 'docus'

export default withDocus({
  rootDir: __dirname,
  buildModules: [
    'vue-plausible/lib/esm'
  ],
  plausible: {
    domain: 'tailwindcss.nuxtjs.org'
  }
})
