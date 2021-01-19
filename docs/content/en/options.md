---
title: Options
description: 'You can configure the module easily with the tailwindcss property.'
position: 3
category: Getting started
---

You can configure the module by using the `tailwindcss` property in the `nuxt.config.js`:

```js{}[nuxt.config.js]
export default {
  // Defaults options
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    config: {}
  }
}
```

## `cssPath`

- Default: `'~/assets/css/tailwind.css'`

Define the path of the Tailwind CSS file, **if the file exists, it will be imported instead of the module's default.**.

```js{}[nuxt.config.js]
export default {
  tailwindcss: {
    cssPath: '~/assets/tailwind.css'
  }
}
```

This file will be directly injected as a [global css](https://nuxtjs.org/guides/configuration-glossary/configuration-css) for Nuxt, it supports `css`, `sass`, `postcss`, and more.

## `configPath`

- Default: `'tailwind.config.js'`

Define the path of the Tailwind configuration file, **if the file exists, it will be imported**.

<alert type="info">

By default, the module already configure the Tailwind configuration to works perfectly with Nuxt. Read more in the [Tailwind Config section](/tailwind-config).

</alert>

You can create the default `tailwind.config.js` file by running:

```bash
npx tailwindcss init
```

Example of overwriting the location of the config path:

```js{}[nuxt.config.js]
export default {
  tailwindcss: {
    configPath: '~/config/tailwind.js'
  }
}
```

## `exposeConfig`

If you need resolved tailwind config in runtime, you can enable exposeConfig option in nuxt.config:

```js{}[nuxt.config.js]
export default {
  tailwindcss: {
    exposeConfig: true
  }
}
```

Learn more about it in the [Referencing in the application](/tailwind-config#referencing-in-the-application) section.


## `config`

- Default: [see tailwind config section](/tailwind-config)

You can directly extend the Tailwind config with the `config` property, it uses [defu.fn](https://github.com/nuxt-contrib/defu#function-merger) to overwrites the defaults.

```js{}[nuxt.config.js]
export default {
  tailwindcss: {
    config: {
      /* Extend the Tailwind config here */
      purge: {
        content: [
          'content/**/**.md'
        ]
      }
    }
  }
}
```

Learn more about overwriting Tailwind config [here](/tailwind-config).

## `viewer`

- Default: `true` in development
- Version: <badge>v3.4+</badge>

<alert type="info">

The [Tailwind viewer](/tailwind-viewer) is only available in development with `nuxt dev`.

</alert>

The module internally use [tailwind-config-viewer](https://github.com/rogden/tailwind-config-viewer) to setup the `/_tailwind/` route.

To disable the viewer in development, set it to `false`:

```js{}[nuxt.config.js]
export default {
  tailwindcss: {
    viewer: false
  }
}
```
