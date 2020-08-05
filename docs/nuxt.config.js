import theme from '@nuxt/content-theme-docs'

export default theme({
  generate: {
    routes: ['/'],
    fallback: '404.html'
  },
  buildModules: [
    // https://github.com/bdrtsky/nuxt-ackee
    'nuxt-ackee'
  ],
  ackee: {
    server: 'https://ackee.nuxtjs.com',
    domainId: '9dfafc05-b435-4ebd-a474-b836e6678e92',
    detailed: true
  }
})
