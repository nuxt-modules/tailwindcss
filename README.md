<p align="center"><img src="https://user-images.githubusercontent.com/904724/59274615-fcef5780-8c5a-11e9-8b17-5c4915895144.png" alt="nuxt-tailwindcss" width="500"/></p>
<p align="center">
  <a href="https://npmjs.com/package/@nuxtjs/tailwindcss"><img src="https://img.shields.io/npm/dt/@nuxtjs/tailwindcss.svg?style=flat-square" alt="npm version"></a>
  <a href="https://npmjs.com/package/@nuxtjs/tailwindcss"><img src="https://img.shields.io/npm/v/@nuxtjs/tailwindcss/latest.svg?style=flat-square" alt="npm downloads"></a>
  <a href="https://circleci.com/gh/nuxt-community/nuxt-tailwindcss"><img src="https://img.shields.io/circleci/project/github/nuxt-community/nuxt-tailwindcss.svg?style=flat-square" alt="circle ci"></a>
  <a href="https://codecov.io/gh/nuxt-community/nuxt-tailwindcss"><img src="https://img.shields.io/codecov/c/github/nuxt-community/nuxt-tailwindcss.svg?style=flat-square" alt="coverage"></a>
  <a href="https://www.npmjs.com/package/@nuxtjs/tailwindcss"><img src="https://badgen.net/npm/license/@nuxtjs/tailwindcss" alt="License"></a>
</p>

> [TailwindCSS](https://tailwindcss.com) module for [Nuxt.js](https://nuxtjs.org) with [nuxt-purgecss](https://github.com/Developmint/nuxt-purgecss) + [modern css](https://tailwindcss.com/docs/using-with-preprocessors#future-css-features) ⚡️

## Infos

- 📖 [Release Notes](./CHANGELOG.md)
- 🏀 [Online playground](https://codesandbox.io/s/o4vn5pvp7q)
- 🌿 [CSS Nesting Module Draft](https://drafts.csswg.org/css-nesting-1/)

## Setup

1. Add `@nuxtjs/tailwindcss` dependency to your project
```bash
npm install --save-dev @nuxtjs/tailwindcss # or yarn add --dev @nuxtjs/tailwindcss
```

2. Add `@nuxtjs/tailwindcss` to the `devModules` section of `nuxt.config.js`
```js
{
  devModules: [
    '@nuxtjs/tailwindcss'
  ]
}
```

## Usage

This module will automatically create two files in your [srcDir](https://nuxtjs.org/api/configuration-srcdir):
- `~/tailwind.config.js`
- `~/assets/css/tailwind.css`

It will also inject the CSS file globally and configure [nuxt-purgecss](https://github.com/Developmint/nuxt-purgecss) and [postcss-preset-env](https://preset-env.cssdb.org) to [stage 1](https://preset-env.cssdb.org/features#stage-1).

## Configuration

If you want to set a different path for the configuration file or css file, you can use these given options:

```js
// nuxt.config.js
{
  devModules: [
    '@nuxtjs/tailwindcss'
  ],
  tailwindcss: {
    configPath: '~/config/tailwind.config.js',
    cssPath: '~/assets/css/tailwind.css'
  }
}
```

If you want to set any (additional) purgeCSS configuration options, you can add a purgeCSS configuration object:

```js
// nuxt.config.js
{
  purgeCSS: {
    whitelist: ['css-selector-to-whitelist'],
  },
}
```

See full options here: https://github.com/Developmint/nuxt-purgecss#options

## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Nuxt.js Team
