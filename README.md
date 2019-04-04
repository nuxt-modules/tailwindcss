# nuxt-tailwindcss

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Circle CI][circle-ci-src]][circle-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![Dependencies][david-dm-src]][david-dm-href]
[![Standard JS][standard-js-src]][standard-js-href]

> TailwindCSS module for Nuxt.js

[📖 **Release Notes**](./CHANGELOG.md)

## Setup

1. Add the `nuxt-tailwindcss` dependency with `yarn` or `npm` to your project
2. Add `nuxt-tailwindcss` to the `modules` section of `nuxt.config.js`
3. Configure it:

```js
{
  modules: [
    // Simple usage
    'nuxt-tailwindcss',

    // With options
    ['nuxt-tailwindcss', { /* module options */ }]
  ]
}
```

## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Sébastien Chopin <seb@chopin.io>

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/dt/nuxt-tailwindcss.svg?style=flat-square
[npm-version-href]: https://npmjs.com/package/nuxt-tailwindcss

[npm-downloads-src]: https://img.shields.io/npm/v/nuxt-tailwindcss/latest.svg?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/nuxt-tailwindcss

[circle-ci-src]: https://img.shields.io/circleci/project/github/nuxt-community/tailwindcss.svg?style=flat-square
[circle-ci-href]: https://circleci.com/gh/nuxt-community/tailwindcss

[codecov-src]: https://img.shields.io/codecov/c/github/nuxt-community/tailwindcss.svg?style=flat-square
[codecov-href]: https://codecov.io/gh/nuxt-community/tailwindcss

[david-dm-src]: https://david-dm.org/nuxt-community/tailwindcss/status.svg?style=flat-square
[david-dm-href]: https://david-dm.org/nuxt-community/tailwindcss

[standard-js-src]: https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square
[standard-js-href]: https://standardjs.com
