<p align="center"><img src="https://user-images.githubusercontent.com/904724/59274615-fcef5780-8c5a-11e9-8b17-5c4915895144.png" alt="tailwindcss-module" width="500"/></p>
<p align="center">
  <a href="https://npmjs.com/package/@nuxtjs/tailwindcss"><img src="https://img.shields.io/npm/v/@nuxtjs/tailwindcss/latest.svg" alt="npm downloads"></a>
  <a href="https://npmjs.com/package/@nuxtjs/tailwindcss"><img src="https://img.shields.io/npm/dt/@nuxtjs/tailwindcss.svg" alt="npm version"></a>
  <a href="https://github.com/nuxt-community/tailwindcss-module/actions?query=workflow%3Aci"><img src="https://github.com/nuxt-community/tailwindcss-module/workflows/ci/badge.svg" alt="github ci"></a>
  <a href="https://codecov.io/gh/nuxt-community/tailwindcss-module"><img src="https://img.shields.io/codecov/c/github/nuxt-community/tailwindcss-module.svg" alt="coverage"></a>
  <a href="https://www.npmjs.com/package/@nuxtjs/tailwindcss"><img src="https://badgen.net/npm/license/@nuxtjs/tailwindcss" alt="License"></a>
</p>

> [Tailwind CSS](https://tailwindcss.com) module for [NuxtJS](https://nuxtjs.org) with [modern css](https://tailwindcss.com/docs/using-with-preprocessors#future-css-features) ⚡️

## Infos

- 📖 [Release Notes](https://github.com/nuxt-community/tailwindcss-module/releases)
- 🏀 [Online playground](https://codesandbox.io/s/o4vn5pvp7q)
- 🌿 [CSS Nesting Module Draft](https://drafts.csswg.org/css-nesting-1/)
- 📐 [Display your breakpoints with nuxt-breaky](https://github.com/teamnovu/nuxt-breaky) 
- 🌓 [Dark mode example](https://codesandbox.io/s/nuxt-dark-tailwindcss-17g2j?file=/tailwind.config.js) with [tailwindcss-dark-mode](https://github.com/ChanceArthur/tailwindcss-dark-mode) and [@nuxtjs/color-mode](https://github.com/nuxt-community/color-mode-module)

## Setup

1. Add `@nuxtjs/tailwindcss` dependency to your project
```bash
npm install --save-dev @nuxtjs/tailwindcss # or yarn add --dev @nuxtjs/tailwindcss
```

2. Add `@nuxtjs/tailwindcss` to the `buildModules` section of `nuxt.config.js`

```js
{
  buildModules: [
    '@nuxtjs/tailwindcss'
  ]
}
```

ℹ️ If you are using `nuxt < 2.9.0`, use `modules` property instead.

## Usage

This module will automatically create two files in your [srcDir](https://nuxtjs.org/api/configuration-srcdir):
- `~/tailwind.config.js`
- `~/assets/css/tailwind.css`

It will also inject the CSS file globally and configure the [purge option](https://tailwindcss.com/docs/controlling-file-size#removing-unused-css) and [postcss-preset-env](https://preset-env.cssdb.org) to [stage 1](https://preset-env.cssdb.org/features#stage-1).

## Configuration

If you want to set a different path for the configuration file or css file, you can use these given options:

```js
// nuxt.config.js
{
  buildModules: [
    '@nuxtjs/tailwindcss'
  ],
  tailwindcss: {
    configPath: '~/config/tailwind.config.js',
    cssPath: '~/assets/css/tailwind.css',
    exposeConfig: false
  }
}
```

To enable purgeCSS in development, set `purge.enabled: true` in `tailwind.config.js`, be careful that it will slow down your development process. Learn more on [removing unused CSS](https://tailwindcss.com/docs/controlling-file-size#removing-unused-css).

## Referencing in JavaScript

It can often be useful to reference tailwind configuration values in runtime. For example to access some of your theme values when dynamically applying inline styles in a component.

If you need resolved tailwind config in runtime, you can enable `exposeConfig` option in `nuxt.config`:

```js
// nuxt.config.js
{
  tailwindcss: {
    exposeConfig: true
  }
}
```

Then import where needed from `~tailwind.config`:

```js
// Import fully resolved config
import tailwindConfig from '~tailwind.config'

 // Import only part which is required to allow tree-shaking
import { theme } from '~tailwind.config'
```

**NOTE:** Please be aware this adds **~19.5KB (~3.5KB)** to the client bundle size.

## Contributing

You can contribute to this module online with CodeSandBox:

[![Edit @nuxtjs/tailwindcss](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/nuxt-community/tailwindcss-module/tree/master/?fontsize=14&hidenavigation=1&theme=dark)

Or locally:

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `yarn dev` or `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Nuxt.js Team
