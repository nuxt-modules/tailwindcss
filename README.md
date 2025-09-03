[![@nuxtjs/tailwindcss](https://tailwindcss.nuxtjs.org/social-card.png)](https://tailwindcss.nuxtjs.org)

# Nuxt Tailwind

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]
[![Tailwind CSS][tw-src]][tw-href]

Enable [Tailwind CSS](https://tailwindcss.com) for [Nuxt](https://nuxt.com) ⚡️

[📖 &nbsp;Documentation](https://tailwindcss.nuxtjs.org) | [▶️ Play online](https://stackblitz.com/github/nuxt-modules/tailwindcss) | [✨ &nbsp;Release Notes](https://github.com/nuxt-modules/tailwindcss/releases)

## Features

- 👌&nbsp; Zero configuration to start
- 📦&nbsp; Extendable by [Nuxt modules](https://nuxt.com/modules) using [hooks](https://tailwindcss.nuxtjs.org/tailwindcss/config#hooks)

## Quick Setup

Add `@nuxtjs/tailwindcss` using the [Nuxt CLI](https://github.com/nuxt/cli) to your project

```bash
npx nuxi@latest module add tailwindcss
```

<details>

<summary>..or install using your dependency manager</summary>

```bash
# Using pnpm
pnpm add --save-dev @nuxtjs/tailwindcss

# Using yarn
yarn add --dev @nuxtjs/tailwindcss

# Using npm
npm install --save-dev @nuxtjs/tailwindcss
```

and then to the `modules` section of `nuxt.config.{ts,js}`

```ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss'
  ]
})
```

</details>


That's it! You can now use Tailwind classes in your Nuxt app ✨

## Contributing

You can contribute to this module online:

[![Edit @nuxtjs/tailwindcss in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/github/nuxt-modules/tailwindcss/tree/main/?fontsize=14&hidenavigation=1&theme=dark)
[![Edit @nuxtjs/tailwindcss in Codeflow](https://developer.stackblitz.com/img/open_in_codeflow.svg)](https://pr.new/nuxt-modules/tailwindcss)

<details>
<summary>..or locally</summary>

1. Clone this repository
2. Install dependencies using `pnpm i`
3. Prepare for development using `pnpm dev:prepare`
4. Start development server using `pnpm dev`

</details>

## License

[MIT](./LICENSE) - Made with 💚

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@nuxtjs/tailwindcss/latest.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-version-href]: https://npmjs.com/package/@nuxtjs/tailwindcss

[npm-downloads-src]: https://img.shields.io/npm/dm/@nuxtjs/tailwindcss.svg?style=flat&colorA=18181B&colorB=28CF8D
[npm-downloads-href]: https://npmjs.com/package/@nuxtjs/tailwindcss

[license-src]: https://img.shields.io/npm/l/@nuxtjs/tailwindcss.svg?style=flat&colorA=18181B&colorB=28CF8D
[license-href]: https://npmjs.com/package/@nuxtjs/tailwindcss

[nuxt-src]: https://img.shields.io/badge/Nuxt-18181B?&logo=nuxt
[nuxt-href]: https://nuxt.com

[tw-src]: https://img.shields.io/badge/tailwindcss-0F172A?&logo=tailwindcss
[tw-href]: https://tailwindcss.com
