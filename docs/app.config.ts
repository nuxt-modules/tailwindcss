import { version as pkgVersion } from '../package.json'

export default defineAppConfig({
  ui: {
    primary: 'green',
    gray: 'slate',
    footer: {
      bottom: {
        left: 'text-sm text-gray-500 dark:text-gray-400',
        wrapper: 'border-t border-gray-200 dark:border-gray-800',
      },
    },
  },
  header: {
    logo: {
      light: {
        src: '',
      },
      dark: {
        src: '',
      },
    },
    pkgVersion,
    search: true,
    colorMode: true,
    links: [{
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/nuxt-modules/tailwindcss',
      'target': '_blank',
      'aria-label': 'Docs template on GitHub',
    }],
  },
  footer: {
    credits: 'Copyright © 2023',
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-nuxtdotjs',
      'to': 'https://nuxt.com',
      'target': '_blank',
      'aria-label': 'Nuxt Website',
    }, {
      'icon': 'i-simple-icons-discord',
      'to': 'https://discord.com/invite/ps2h6QT',
      'target': '_blank',
      'aria-label': 'Nuxt Tailwind on Discord',
    }, {
      'icon': 'i-simple-icons-x',
      'to': 'https://x.com/nuxt_js',
      'target': '_blank',
      'aria-label': 'Nuxt on X',
    }, {
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/nuxt-modules/tailwindcss',
      'target': '_blank',
      'aria-label': 'Nuxt Tailwind on GitHub',
    }],
  },
  toc: {
    title: 'Table of Contents',
    bottom: {
      title: 'Community',
      edit: 'https://github.com/nuxt-modules/tailwindcss/edit/main/docs/content',
      links: [{
        icon: 'i-heroicons-star',
        label: 'Star on GitHub',
        to: 'https://github.com/nuxt-modules/tailwindcss',
        target: '_blank',
      }, {
        icon: 'i-simple-icons-nuxtdotjs',
        label: 'Nuxt docs',
        to: 'https://nuxt.com/docs',
        target: '_blank',
      }, {
        icon: 'i-simple-icons-tailwindcss',
        label: 'Tailwind CSS docs',
        to: 'https://tailwindcss.com',
        target: '_blank',
      }],
    },
  },
})
