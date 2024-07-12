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
    content: {
      prose: {
        code: {
          icon: {
            'nuxt.config': 'vscode-icons:file-type-nuxt',
          },
        },
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
    pkgVersion,
    colorMode: false,
    links: [{
      'icon': 'i-simple-icons-nuxtdotjs',
      'to': 'https://nuxt.com',
      'target': '_blank',
      'aria-label': 'Nuxt Website',
    }, {
      'icon': 'i-simple-icons-discord',
      'to': 'https://chat.nuxt.dev/',
      'target': '_blank',
      'aria-label': 'Nuxt Discord',
    }, {
      'icon': 'i-simple-icons-x',
      'to': 'https://twitter.nuxt.dev/',
      'target': '_blank',
      'aria-label': 'Nuxt on X',
    }, {
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/nuxt-modules/tailwindcss',
      'target': '_blank',
      'aria-label': 'GitHub Repository',
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
        label: 'Nuxt documentation',
        to: 'https://nuxt.com/docs',
        target: '_blank',
      }, {
        icon: 'i-simple-icons-tailwindcss',
        label: 'Tailwind CSS',
        to: 'https://tailwindcss.com',
        target: '_blank',
      }],
    },
  },
})
