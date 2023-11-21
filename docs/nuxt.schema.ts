import { field, group } from '@nuxthq/studio/theme'

export default defineNuxtSchema({
  appConfig: {
    ui: group({
      title: 'UI',
      description: 'UI Customization.',
      icon: 'i-mdi-palette-outline',
      fields: {
        icons: group({
          title: 'Icons',
          description: 'Manage icons used in UI Pro.',
          icon: 'i-mdi-application-settings-outline',
          fields: {
            search: field({
              type: 'icon',
              title: 'Search Bar',
              description: 'Icon to display in the search bar.',
              icon: 'i-heroicons-magnifying-glass-20-solid',
              default: 'i-heroicons-magnifying-glass-20-solid'
            }),
            dark: field({
              type: 'icon',
              title: 'Dark mode',
              description: 'Icon of color mode button for dark mode.',
              icon: 'i-heroicons-moon-20-solid',
              default: 'i-heroicons-moon-20-solid'
            }),
            light: field({
              type: 'icon',
              title: 'Light mode',
              description: 'Icon of color mode button for light mode.',
              icon: 'i-heroicons-sun-20-solid',
              default: 'i-heroicons-sun-20-solid'
            }),
            external: field({
              type: 'icon',
              title: 'External Link',
              description: 'Icon for external link.',
              icon: 'i-heroicons-arrow-up-right-20-solid',
              default: 'i-heroicons-arrow-up-right-20-solid'
            }),
            chevron: field({
              type: 'icon',
              title: 'Chevron',
              description: 'Icon for chevron.',
              icon: 'i-heroicons-chevron-down-20-solid',
              default: 'i-heroicons-chevron-down-20-solid'
            }),
            hash: field({
              type: 'icon',
              title: 'Hash',
              description: 'Icon for hash anchors.',
              icon: 'i-heroicons-hashtag-20-solid',
              default: 'i-heroicons-hashtag-20-solid'
            })
          }
        })
      }
    }),
    header: group({
      title: 'Header',
      description: 'Header configuration.',
      icon: 'i-mdi-page-layout-header',
      fields: {
        logo: group({
          title: 'Logo',
          description: 'Footer logo configuration.',
          icon: 'i-mdi-image-filter-center-focus-strong-outline',
          fields: {
            dark: group({
              title: 'Dark',
              description: 'Dark Mode Logo.',
              icon: 'i-heroicons-moon-20-solid',
              fields: {
                src: field({
                  type: 'media',
                  title: 'Logo',
                  description: 'Pick an image from your gallery.',
                  icon: 'i-mdi-image',
                  default: ''
                }),
                alt: field({
                  type: 'string',
                  title: 'Alt',
                  description: 'Alt to display for accessibility.',
                  icon: 'i-mdi-alphabet-latin',
                  default: ''
                })
              }
            }),
            light: group({
              title: 'Light',
              description: 'Light Mode Logo.',
              icon: 'i-heroicons-sun-20-solid',
              fields: {
                src: field({
                  type: 'media',
                  title: 'Logo',
                  description: 'Pick an image from your gallery.',
                  icon: 'i-mdi-image',
                  default: ''
                }),
                alt: field({
                  type: 'string',
                  title: 'Alt',
                  description: 'Alt to display for accessibility.',
                  icon: 'i-mdi-alphabet-latin',
                  default: ''
                })
              }
            }),
          }
        }),
        search: field({
          type: 'boolean',
          title: 'Search Bar',
          description: 'Hide or display the search bar.',
          icon: 'i-mdi-magnify',
          default: true
        }),
        colorMode: field({
          type: 'boolean',
          title: 'Color Mode',
          description: 'Hide or display the color mode button in your header.',
          icon: 'i-heroicons-moon-20-solid',
          default: true
        }),
        links: field({
          type: 'array',
          title: 'Links',
          description: 'Array of link object displayed in header.',
          icon: 'i-mdi-link-variant',
          default: []
        })
      },
    }),
    footer: group({
      title: 'Footer',
      description: 'Footer configuration.',
      icon: 'i-mdi-page-layout-footer',
      fields: {
        credits: field({
          type: 'string',
          title: 'Footer credits section',
          description: 'Text to display as credits in the footer.',
          icon: 'i-mdi-circle-edit-outline',
          default: ''
        }),
        colorMode: field({
          type: 'boolean',
          title: 'Color Mode',
          description: 'Hide or display the color mode button in the footer.',
          icon: 'i-heroicons-moon-20-solid',
          default: false
        }),
        links: field({
          type: 'array',
          title: 'Links',
          description: 'Array of link object displayed in footer.',
          icon: 'i-mdi-link-variant',
          default: []
        })
      }
    }),
    toc: group({
      title: 'Table of contents',
      description: 'TOC configuration.',
      icon: 'i-heroicons-table-cells-solid',
      fields: {
        title: field({
          type: 'string',
          title: 'Title',
          description: 'Text to display as title of the main toc.',
          icon: 'i-mdi-format-title',
          default: ''
        }),
        bottom: group({
          title: 'Bottom',
          description: 'Bottom TOC configuration.',
          icon: 'i-heroicons-bars-arrow-down-solid',
          fields: {
            title: field({
              type: 'string',
              title: 'Title',
              description: 'Text to display as title of the bottom toc.',
              icon: 'i-mdi-format-title',
              default: ''
            }),
            edit: field({
              type: 'string',
              title: 'Edit Page Link',
              description: 'URL of your repository content folder.',
              icon: 'i-heroicons-pencil-square',
              default: ''
            }),
            links: field({
              type: 'array',
              title: 'Links',
              description: 'Array of link object displayed in bottom toc.',
              icon: 'i-mdi-link-variant',
              default: []
            })
          }
        })
      }
    })
  }
})
