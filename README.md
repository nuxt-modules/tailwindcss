[![@nuxtjs/tailwindcss](https://tailwindcss.nuxtjs.org/cover.jpg)](https://tailwindcss.nuxtjs.org)

# Nuxt Tailwind

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]
<a href="https://volta.net/nuxt-modules/tailwindcss?utm_source=nuxt_tailwind_readme"><img src="https://user-images.githubusercontent.com/904724/209143798-32345f6c-3cf8-4e06-9659-f4ace4a6acde.svg" alt="Volta board"></a>

> [Tailwind CSS](https://tailwindcss.com) module for [Nuxt](https://nuxtjs.org) with [modern css](https://tailwindcss.com/docs/using-with-preprocessors#future-css-features) ⚡️

- [✨ &nbsp;Release Notes](https://github.com/nuxt-community/tailwindcss-module/releases)
- [▶️ Play online](https://stackblitz.com/edit/nuxt-starter-rnulzp?file=app.vue)
- [📖 &nbsp;Documentation](https://tailwindcss.nuxtjs.org)

## Features

- 👌&nbsp; Zero configuration to start *([see video](https://tailwindcss.nuxtjs.org/#quick-start))*
- 🪄&nbsp; Includes [CSS Nesting](https://drafts.csswg.org/css-nesting-1/) with [postcss-nesting](https://github.com/csstools/postcss-nesting)
- 🎨&nbsp; Discover your Tailwind Colors *([see video](https://tailwindcss.nuxtjs.org/#tailwind-colors))*
- ⚙️&nbsp; Reference your Tailwind config in your app
- 📦&nbsp; Extendable by [Nuxt modules](https://modules.nuxtjs.org/)
- 🚀&nbsp; [Nuxt 3](https://nuxt.com) support

[📖 &nbsp;Read more](https://tailwindcss.nuxtjs.org)

## Quick Setup

1. Add `@nuxtjs/tailwindcss` dependency to your project

```bash
# Using yarn
yarn add --dev @nuxtjs/tailwindcss

# Using npm
npm install --save-dev @nuxtjs/tailwindcss
```

2. Add `@nuxtjs/tailwindcss` to the `modules` section of `nuxt.config.js`

```js
{
  modules: [
    '@nuxtjs/tailwindcss'
  ]
}
```

That's it! You can now use Tailwind classes in your Nuxt app ✨

[📖 &nbsp;Read more](https://tailwindcss.nuxtjs.org/getting-started/setup)

## Contributing

You can contribute to this module online with CodeSandBox:

[![Edit @nuxtjs/tailwindcss](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/nuxt-community/tailwindcss-module/tree/main/?fontsize=14&hidenavigation=1&theme=dark)

Or locally:

1. Clone this repository
2. Install dependencies using `pnpm i`
3. Prepare for development using `pnpm dev:prepare`
4. Start development server using `pnpm dev`

## License

[MIT License](./LICENSE)

Copyright (c) Nuxt Community

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxtjs/tailwindcss/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@nuxtjs/tailwindcss

[npm-downloads-src]: https://img.shields.io/npm/dm/@nuxtjs/tailwindcss.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@nuxtjs/tailwindcss

[license-src]: https://img.shields.io/npm/l/@nuxtjs/tailwindcss.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@nuxtjs/tailwindcss

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?&logo=nuxt.js
[nuxt-href]: https://nuxt.com
