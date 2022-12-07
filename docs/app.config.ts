export default defineAppConfig({
  docus: {
    title: "Nuxt Tailwind",
    layout: "default",
    url: "https://tailwindcss.nuxtjs.org/",
    description: "Add Tailwind CSS to your Nuxt application in seconds.",
    socials: {
      twitter: "nuxt_js",
      github: "nuxt-modules/tailwindcss",
    },
    image: "/cover.jpg",
    header: {
      title: false,
      logo: true,
    },
    footer: {
      credits: {
        icon: "IconDocus",
        text: "Powered by Docus",
        href: "https://docus.com",
      },
      icons: [
        {
          label: "NuxtJS",
          href: "https://nuxtjs.org",
          component: "IconNuxt",
        },
        {
          label: "Vue Telescope",
          href: "https://vuetelescope.com",
          component: "IconVueTelescope",
        },
      ],
    }
  }
})
