---
title: Tailwind Config
description: 'You can configure the integration easily with the storybook property.'
position: 3
category: Guide
---

`@nuxtjs/tailwindcss` configure the Tailwind configuration to have the best user experience as possible by default.

## Default Configuration

```js
{
  theme: {},
  variants: {},
  plugins: [],
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      'components/**/*.vue',
      'layouts/**/*.vue',
      'pages/**/*.vue',
      'plugins/**/*.js',
      'nuxt.config.js'
    ]
  }
}
```

> The file is [available on GitHub](https://github.com/nuxt-community/tailwindcss-module/blob/master/lib/files/tailwind.config.js)

You can learn more about the [Tailwind configuration](https://tailwindcss.com/docs/configuration) and the [purge option](https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css) on Tailwind docs.

## Overwriting the configuration

You can overwrite the default configuration:
- with a [tailwind.config.js](#tailwindconfigjs) file
- using the [config option](#config-option)
- with the `tailwindcss:config` Nuxt hook

<alert>

The `tailwind.config.js` and `config` options are subject to the [merging strategy](#merging-strategy).

</alert>

### `tailwind.config.js`

If a `tailwind.config.js` file is present, it will be imported and used to overwrite the default configuration.

You can configure the path with the [configPath option](/options#configpath).

```js{}[tailwind.config.js]
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    extend: {
      colors: {
        primary: defaultTheme.colors.green
      }
    }
  }
}
```

Learn more about the [Tailwind config](https://tailwindcss.com/docs/configuration) on their docs.
 
### `config` option

You can also use your `nuxt.config.js` to set your Tailwind Config with the `tailwindcss.config` propert:

```js{}[nuxt.config.js]
import tailwindTypography from '@tailwindcss/typography'

export default {
  // ...
  tailwindcss: {
    config: {
      plugins: [tailwindTypography]
    }
  }
}
```

 `tailwindcss.config` property in your `nuxt.config.js` *(see [config option](/options#config))*

### `tailwindcss:config` hook

To configure the module by using the `tailwindcss` property in the `nuxt.config.js`:

```js{}[nuxt.config.js]
export default {
  // Defaults options
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    config: {},
    exposeConfig: false
  }
}
```


### Merging strategy

The provided config will be merged using [defu function merger](https://github.com/nuxt-contrib/defu#function-merger).

This mean that when giving an array to the `purge.content`, it will concat with the default value.

**Example**

```js{}[tailwind.config.js]
module.exports = {
  purge: {
    content: [
      'content/**/*.md'
    ]
  }
}
```

The `purge.content` option will be:

```js
[
  'components/**/*.vue',
  'layouts/**/*.vue',
  'pages/**/*.vue',
  'plugins/**/*.js',
  'nuxt.config.js',
  'content/**/*.md'
]
```

If you want to fully overwrite, you can use a `function` that receives the default value:

```js{}[tailwind.config.js]
module.exports = {
  purge: {
    content (contentDefaults) {
      return contentDefaults.map(file => file.replace('.js', '.ts'))
    }
  }
}
```

The `purge.content` option will be:

```js
[
  'components/**/*.vue',
  'layouts/**/*.vue',
  'pages/**/*.vue',
  'plugins/**/*.ts',
  'nuxt.config.ts'
]
```

<alert type="info">

This merging strategy of with a function only applies to `plugins` and `purge.content` since the default value is defined as an `Array`

</alert>


## `exposeConfig`

If you need resolved tailwind config in runtime, you can enable exposeConfig option in nuxt.config:

```js{}[nuxt.config.js]
export default {
  tailwindcss: {
    exposeConfig: true
  }
}
```

Learn more about it in the [Tailwind config section](/tailwind-config).
