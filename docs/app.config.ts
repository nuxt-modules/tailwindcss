export default defineAppConfig({
  docus: {
    title: 'Nuxt Tailwind',
    description: 'Add Tailwind CSS to your Nuxt application in seconds.',
    image: 'https://tailwindcss.nuxtjs.org/social-card.png',
    socials: {
      twitter: 'nuxt_js',
      github: 'nuxt-modules/tailwindcss',
      nuxt: {
        label: 'Nuxt',
        icon: 'simple-icons:nuxtdotjs',
        href: 'https://nuxt.com'
      },
      supabase: {
        label: 'Tailwind CSS',
        icon: 'simple-icons:tailwindcss',
        href: 'https://tailwindcss.com'
      }
    },
    header: {
      logo: true
    }
  }
})
