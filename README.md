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
- 🚀&nbsp; [Nuxt 3](https://v3.nuxtjs.org) support

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
2. Install dependencies using `yarn install`
3. Prepare for development using `yarn dev:prepare`
4. Start development server using `yarn dev`

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

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?&logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAAoCAYAAABNefLBAAAAAXNSR0IArs4c6QAAA91JREFUaEPNWdtV20AQvSsVEDoIPoh8QwWBDkwFkApiCrCQ5QICFcSpIKQCoAL4DuJgOoAC2M0Zy8Y23pl9SEqyv9rH3J2rO3d3Fdpuv4s9JMkZgP586glSPUKvmLa9VOx8Knagddz9+ADKXFm+PSPV+/8L8PZAPxZbeE1uAWwzG3mNLD9sdZMjJ2sP9P2ogFJEa6GpI2TDy8hYWxvWDujHYhuvyaNHVNM5zZ89+nbWpR3QVUn/8YFXlMaMsHtWePXtqFNz0NW4D5ifQfGluuclarUwfgWwBWAKrS/wqbgLWsvSuRlot3hx8blFrSq/AzixTPAFWT5pArwZaFm8nuYZ+mAPUBA1mT2Ny188aJd4GXUI6ANB0e2i5sceN1OkGhJNE1m8fiHLa0dWleTEPlrXsYmaV+kDQJu6O7yOiT8u0y7xWhUq3qVRvOtUdbFnHeEUWd77i6BLqsl252XLXlVSRj4zAV4iy4/mrPAvfTQgsvyFZ9olXqneQ69YNx+uDM7+f4Dx7VIyo0QtDHQdPPlrqpu2CsjbTHmzFicwzre/AGCqAJZM8eR6GOiqJBOyODK+X+IGWc67slqVyVjYRY0P+Ala95HMNtveAkXNH7QsSICPy3IJoMQeF1MCRM0fdBUoXlxWZFHj2eNiSoCo+YGOES8OtEvUVse9Z09LTs0Nuol4ccB9DAiXOd/y18iRNREvPtsuUXuCrfTRfPUdXCNRkzPdhnjZgDdlTzU6BxQdOTebUnfYGe5L1UsG/TC+hTF7TJ24QHY28CyN692asqcWNart9tqtcIqd/JyLjQf9UA5g8I0Z+IJUb284L58daIs9VUlnbTpz2xo5NbqosF5L2UHXO0n+mnFeiD/It1X6CKooauoHsqHtEgJ20NV4AphjZhdl5yVlW1btcPZEitomaBf9tN6Puqfqij0RorYJujPx6og9EaK2DvpfiVcsexa/UqCoLUF3RT+aV6dXnZS+Vf0IELUl6K7Ei7/KpZDDxYu1tuzjYT1i5fhZg+5KvGTAtHJ86bOBlxP3doNagxZvNvl6x1ananQMlQx4Ss9Gxpc+bmGXqM03WUEWAYC8rDEhD24+b1pEa7pLsz/U1zFxPsHl+8g2c6Zq5tQUxBLlmj/6O09rt6BGLzobqHBKmTbNZgkeLf/H8n8ZvNjGAGNGBJp/gWi+xOoMdKM5EB/fXLayjXhmmfa5xWi+2A1SfeJ8ng15546LaaYlc/UWLWLc9FSDoS5hMPF6c3IJamwUy3EvMKpPsSzNCVFLKe5O239JpaYwauoFdHVWssDacKrrv76tZ6KekejJ4nz9B5NWGK+XC+AAAAAAAElFTkSuQmCC
[nuxt-href]: https://nuxt.com
