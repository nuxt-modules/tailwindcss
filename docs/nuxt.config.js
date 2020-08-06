import theme from '@nuxt/content-theme-docs'

export default theme({
  env: {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN
  },
  loading: { color: '#38b2ac' },
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
