import { withDocus } from 'docus'

export default withDocus({
  docus: {
    colors: {
      primary: '#38b2ac'
    }
  },
  buildModules: [
    'vue-plausible'
  ],
  plausible: {
    domain: 'tailwindcss.nuxtjs.org'
  }
})
