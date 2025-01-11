[![@nuxtjs/tailwindcss](https://tailwindcss.nuxtjs.org/social-card.png)](https://tailwindcss.nuxtjs.org)

# Nuxt Tailwind

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![License][license-src]][license-href]
[![Nuxt][nuxt-src]][nuxt-href]
[![Tailwind CSS][tw-src]][tw-href]
[![Volta board][volta-src]][volta-href]

Enable [Tailwind CSS](https://tailwindcss.com) for [Nuxt](https://nuxt.com) ⚡️

[📖 &nbsp;Documentation](https://tailwindcss.nuxtjs.org) | [▶️ Play online](https://stackblitz.com/github/nuxt-modules/tailwindcss) | [✨ &nbsp;Release Notes](https://github.com/nuxt-modules/tailwindcss/releases)

## Features

- 👌&nbsp; Zero configuration to start
- 🪄&nbsp; Includes [CSS Nesting](https://drafts.csswg.org/css-nesting-1/) with [postcss-nesting](https://github.com/csstools/postcss-nesting)
- 🎨&nbsp; Discover your Tailwind Config & Colors *([see video](https://tailwindcss.nuxtjs.org/getting-started/module-options#viewer))*
- ⚙️&nbsp; [Reference your Tailwind config](https://tailwindcss.nuxtjs.org/tailwindcss/configuration/#referencing-in-the-application) in your app
- 📦&nbsp; Extendable by [Nuxt modules](https://nuxt.com/modules) using [hooks](https://tailwindcss.nuxtjs.org/tailwindcss/config#hooks)
- 🚀&nbsp; Supports both [Nuxt 3](https://nuxt.com) and [Nuxt 2](https://v2.nuxt.com/)

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

### Docs

[![Nuxt UI Pro](https://img.shields.io/badge/Made%20with-Nuxt%20UI%20Pro-00DC82?logo=nuxt.js&labelColor=020420)](https://ui.nuxt.com/pro)

You can run `docs/` locally by using `pnpm docs:dev`, or to run a build:

1. Make sure to add your [Nuxt UI Pro](https://ui.nuxt.com/pro) license in the `.env` file before building the application.
2. Run SSG build using `pnpm docs:build`
3. Review the production build locally using `pnpm docs:preview`

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

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

[volta-src]: https://user-images.githubusercontent.com/904724/209143798-32345f6c-3cf8-4e06-9659-f4ace4a6acde.svg
[volta-href]: https://volta.net/nuxt-modules/tailwindcss?utm_source=nuxt_tailwind_readme
