---
title: Setup
description: 'Using TailwindCSS in your Nuxt project is only one command away'
position: 2
category: Getting started
---

Using TailwindCSS in your Nuxt project is only one command away ✨

## Installation

Add `@nuxtjs/tailwindcss` dependency to your project:

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn add --dev @nuxtjs/tailwindcss
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm install --save-dev @nuxtjs/tailwindcss
  ```

  </code-block>
</code-group>

Then add it to your `buildModules` section in your `nuxt.config.js`:

```js{}[nuxt.config.js]
export default {
  buildModules: ['@nuxtjs/tailwindcss']
}
```

> If you are using `nuxt < 2.9.0`, use the `modules` property instead.

<alert type="success">

That's it! You can now use Tailwind classes in your Nuxt app ✨

</alert>

<alert type="info">

Discover your color palette based on your Tailwind config on `/_tailwind` route.

</alert>

## Tailwind Files

When running `nuxt dev`, this module will look for these two files:

- `./assets/css/tailwind.css`
- `./tailwind.config.js`

If they don't exist, the module will inject a basic configuration for each one so you don't have to create these files.

<alert type="info">

You can configure the paths in the [module options](/options).

</alert>

Learn more about overwriting the Tailwind configuration in the [Tailwind Config](/tailwind-config) section.

## Options

You can customize the module behaviour by using the `tailwindcss` property in `nuxt.config.js`:

```js{}[nuxt.config.js]
export default {
  tailwindcss: {
    // Options
  }
}
```

See the [module options](/options).

## Upgrading Tailwind

### Tailwind 2

Nuxt 2.14 is still using PostCSS 7, we have a [pull request](https://github.com/nuxt/nuxt.js/pull/8346) opened to upgrade the dependencies. Once merged on `v2.15`, we will release a major version of this module to include TailwindCSS 2, see [PR#203](https://github.com/nuxt-community/tailwindcss-module/pull/203).

In the meantime, you can upgrade Tailwind by using the [compatibility build](https://tailwindcss.com/docs/installation#post-css-7-compatibility-build):

```bash
yarn add --dev tailwindcss@npm:@tailwindcss/postcss7-compat postcss@^7 autoprefixer@^9
```

Please ensure you are using `Node >= 12.13.0` in order to use version 2 of TailwindCSS.

<alert type="warning">

We have seen an issue with NPM regarding the packages resolution (see [comment](https://github.com/nuxt-community/tailwindcss-module/issues/202#issuecomment-738442349)), we highly recommend using [Yarn V1](https://classic.yarnpkg.com/en/docs/install) when working with Nuxt 2.

</alert>

### Tailwind 1

When a new version of Tailwind CSS is released, you don't need to wait for this module to upgrade, you can directly upgrade your dependencies.

<code-group>
  <code-block label="Yarn" active>

  ```bash
  yarn upgrade
  ```

  </code-block>
  <code-block label="NPM">

  ```bash
  npm update
  ```

  </code-block>
</code-group>
