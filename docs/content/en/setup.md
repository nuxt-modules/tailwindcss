---
title: Setup
description: ''
position: 2
category: Guide
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

That's it! You can now use Tailwind classes in your Nuxt app ✨

## Tailwind Files

When running `nuxt dev`, this module will look for these two files:

- `./assets/css/tailwind.css`
- `./tailwind.config.js`

If they don't exists, the module will inject a basic configuration for each one so you don't have to create these files.

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
