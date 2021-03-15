import { withDocus } from 'docus'

export default withDocus({
  buildModules: [
    'vue-plausible/lib/esm'
  ],
  plausible: {
    domain: 'tailwindcss.nuxtjs.org'
  }
})
