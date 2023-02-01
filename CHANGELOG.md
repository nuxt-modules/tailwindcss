# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [6.3.1](https://github.com/nuxt-community/tailwindcss-module/compare/v6.3.0...v6.3.1) (2023-02-01)


### Bug Fixes

* support layers in correct order and watch config to warn restart ([0357676](https://github.com/nuxt-community/tailwindcss-module/commit/0357676c76d192d4ac2ae5ad5eed1d3ca7709afd))

## [6.3.0](https://github.com/nuxt-community/tailwindcss-module/compare/v6.2.0...v6.3.0) (2023-01-25)


### Features

* **exposeConfig:** nested properties ([#583](https://github.com/nuxt-community/tailwindcss-module/issues/583)) ([e88c23a](https://github.com/nuxt-community/tailwindcss-module/commit/e88c23ab6237d69450617773bd75e8fdd3402bfd))


### Bug Fixes

* considered content as function ([#592](https://github.com/nuxt-community/tailwindcss-module/issues/592)) ([cf67d89](https://github.com/nuxt-community/tailwindcss-module/commit/cf67d892914ff6b38c7740aaa585d4ad93f6fba6))
* css intellisense not working ([#596](https://github.com/nuxt-community/tailwindcss-module/issues/596)) ([de81e7d](https://github.com/nuxt-community/tailwindcss-module/commit/de81e7d7bca9a70eabca1e23c23c6302334fe758)), closes [#593](https://github.com/nuxt-community/tailwindcss-module/issues/593)

## [6.2.0](https://github.com/nuxt-community/tailwindcss-module/compare/v6.1.3...v6.2.0) (2022-12-19)


### Features

* **docs:** upgrade to latest Docus ([#580](https://github.com/nuxt-community/tailwindcss-module/issues/580)) ([462410a](https://github.com/nuxt-community/tailwindcss-module/commit/462410a246edae25ccfe38f0bb2f6f47a626dc04))


### Bug Fixes

* **exposeConfig:** named exports in mjs for tree-shaking ([#582](https://github.com/nuxt-community/tailwindcss-module/issues/582)) ([6c3168d](https://github.com/nuxt-community/tailwindcss-module/commit/6c3168da0bf59f15e3a53eaacb1abd382b62206e))

### [6.1.3](https://github.com/nuxt-community/tailwindcss-module/compare/v6.1.2...v6.1.3) (2022-11-03)


### Bug Fixes

* css option in  object format error. ([#557](https://github.com/nuxt-community/tailwindcss-module/issues/557)) ([2408a1e](https://github.com/nuxt-community/tailwindcss-module/commit/2408a1edcac909bf29a438b5908e9246392dc105))

### [6.1.2](https://github.com/nuxt-community/tailwindcss-module/compare/v6.1.1...v6.1.2) (2022-10-28)


### Bug Fixes

* normalise undefined `nuxt.options.watch` ([#553](https://github.com/nuxt-community/tailwindcss-module/issues/553)) ([5b373c6](https://github.com/nuxt-community/tailwindcss-module/commit/5b373c6c1091808360db4a657210e21adf205d73))

### [6.1.1](https://github.com/nuxt-community/tailwindcss-module/compare/v6.1.0...v6.1.1) (2022-10-24)


### Bug Fixes

* `cjs` config generation ([#551](https://github.com/nuxt-community/tailwindcss-module/issues/551)) ([bd64377](https://github.com/nuxt-community/tailwindcss-module/commit/bd643774be36e3e6b2e9a7b54e9141a706f6a3c6))

## [6.1.0](https://github.com/nuxt-community/tailwindcss-module/compare/v6.0.1...v6.1.0) (2022-10-21)


### Features

* add option to set `cssPath` to `false` ([#544](https://github.com/nuxt-community/tailwindcss-module/issues/544)) ([f45fc97](https://github.com/nuxt-community/tailwindcss-module/commit/f45fc97b87eb63acdf9568d917177322d957ac82))

### [6.0.1](https://github.com/nuxt-community/tailwindcss-module/compare/v6.0.0...v6.0.1) (2022-10-19)

## [6.0.0](https://github.com/nuxt-community/tailwindcss-module/compare/v5.3.5...v6.0.0) (2022-10-19)


### ⚠ BREAKING CHANGES

* update viewer dev middleware to be compatible with `h3@0.8` (#545)
* You can no longer use CJS syntax (`module.exports`) in your `tailwind.config.js` (#549)

### Features

* expose config as commonjs file ([#535](https://github.com/nuxt-community/tailwindcss-module/issues/535)) ([af87449](https://github.com/nuxt-community/tailwindcss-module/commit/af8744972ba2409fd6a468829addb963824168e5))
* update viewer dev middleware to be compatible with `h3@0.8` ([#545](https://github.com/nuxt-community/tailwindcss-module/issues/545)) ([0b1844e](https://github.com/nuxt-community/tailwindcss-module/commit/0b1844efec4ed594d852938f6091178a5401f7d9))

### [5.3.5](https://github.com/nuxt-community/tailwindcss-module/compare/v5.3.4...v5.3.5) (2022-10-07)


### Bug Fixes

* prevent unwanted reloads on content change ([#539](https://github.com/nuxt-community/tailwindcss-module/issues/539)) ([6290ea5](https://github.com/nuxt-community/tailwindcss-module/commit/6290ea58123df76eae75e7304b7c0c95300a43b7))

### [5.3.4](https://github.com/nuxt-community/tailwindcss-module/compare/v5.3.3...v5.3.4) (2022-10-07)


### Bug Fixes

* remove content from tailwindConfig.content in development ([51cfad7](https://github.com/nuxt-community/tailwindcss-module/commit/51cfad7aa611f543c4b5ce0b5b9f24c08348e7d3))

### [5.3.3](https://github.com/nuxt-community/tailwindcss-module/compare/v5.3.2...v5.3.3) (2022-09-08)


### Bug Fixes

* resolve config paths fully and warn on config errors ([#522](https://github.com/nuxt-community/tailwindcss-module/issues/522)) ([6a6dc4f](https://github.com/nuxt-community/tailwindcss-module/commit/6a6dc4fc4dffefeb2141722cd8058d50ff27038e))

### [5.3.2](https://github.com/nuxt-community/tailwindcss-module/compare/v5.3.1...v5.3.2) (2022-08-12)


### Bug Fixes

* **module:** remove prefix for tailwind viewer route on nuxt 2 ([#517](https://github.com/nuxt-community/tailwindcss-module/issues/517)) ([2932bad](https://github.com/nuxt-community/tailwindcss-module/commit/2932bad5edf9d2e8adadeaa8363923fcaa8779ec))
* remove now-unneeded `@types/tailwindcss` ([#514](https://github.com/nuxt-community/tailwindcss-module/issues/514)) ([82ea9b7](https://github.com/nuxt-community/tailwindcss-module/commit/82ea9b7d8dc7526641f359ded5d037f9492d7a7f))

### [5.3.1](https://github.com/nuxt-community/tailwindcss-module/compare/v5.3.0...v5.3.1) (2022-07-25)


### Bug Fixes

* **module:** Nuxt 2 support ([#508](https://github.com/nuxt-community/tailwindcss-module/issues/508)) ([366ddc3](https://github.com/nuxt-community/tailwindcss-module/commit/366ddc3e2688a3cc86ba7b8c28b8c632104ed35f))

## [5.3.0](https://github.com/nuxt-community/tailwindcss-module/compare/v5.2.0...v5.3.0) (2022-07-13)


### Features

* extends support ([#499](https://github.com/nuxt-community/tailwindcss-module/issues/499)) ([f90b80b](https://github.com/nuxt-community/tailwindcss-module/commit/f90b80b0289f3ab0285826fae727c37e560db657))
* support for more semantic injection positions ([#501](https://github.com/nuxt-community/tailwindcss-module/issues/501)) ([1bdd83c](https://github.com/nuxt-community/tailwindcss-module/commit/1bdd83cc2bdb39cb80ad476a22b791f3bdeb9cb9))

## [5.2.0](https://github.com/nuxt-community/tailwindcss-module/compare/v5.1.3...v5.2.0) (2022-07-11)


### Features

* add tailwind.config.ts support ([#483](https://github.com/nuxt-community/tailwindcss-module/issues/483)) ([26aebc2](https://github.com/nuxt-community/tailwindcss-module/commit/26aebc2a4cb3be7fa1cc31d842becedec65827e8))


### Bug Fixes

* monkey-patch Vite HMR issue & make it reproducible ([#464](https://github.com/nuxt-community/tailwindcss-module/issues/464)) ([#496](https://github.com/nuxt-community/tailwindcss-module/issues/496)) ([8cc1cfa](https://github.com/nuxt-community/tailwindcss-module/commit/8cc1cfa5684581d7c85f94ea2d6f60c5e4abf52a))

### [5.1.3](https://github.com/nuxt-community/tailwindcss-module/compare/v5.1.2...v5.1.3) (2022-06-22)


### Bug Fixes

* add prefix for tailwind viewer route ([#460](https://github.com/nuxt-community/tailwindcss-module/issues/460)) ([9df49b5](https://github.com/nuxt-community/tailwindcss-module/commit/9df49b5f2559c3034424ed7e19b621d814682b71))

### [5.1.2](https://github.com/nuxt-community/tailwindcss-module/compare/v5.1.1...v5.1.2) (2022-05-23)


### Bug Fixes

* use correct defuArrayFn and fix srcDir error ([cef3a9f](https://github.com/nuxt-community/tailwindcss-module/commit/cef3a9f68310deb512f2c6592516a986801d439d))

### [5.1.1](https://github.com/nuxt-community/tailwindcss-module/compare/v5.1.0...v5.1.1) (2022-05-23)


### Bug Fixes

* **content:** Add support for error file ([#467](https://github.com/nuxt-community/tailwindcss-module/issues/467)) ([be06c68](https://github.com/nuxt-community/tailwindcss-module/commit/be06c687f2605ffc57b202878ac5a1a68147a4cd))

## [5.1.0](https://github.com/nuxt-community/tailwindcss-module/compare/v5.0.4...v5.1.0) (2022-05-23)


### Features

* resolve `cssPath` with `resolvePath` ([#465](https://github.com/nuxt-community/tailwindcss-module/issues/465)) ([656eea5](https://github.com/nuxt-community/tailwindcss-module/commit/656eea5ed53206b102951bfcef8fc161f55f6cad))

### [5.0.4](https://github.com/nuxt-community/tailwindcss-module/compare/v5.0.3...v5.0.4) (2022-05-02)


### Bug Fixes

* add tailwindcss types ([#462](https://github.com/nuxt-community/tailwindcss-module/issues/462)) ([379c816](https://github.com/nuxt-community/tailwindcss-module/commit/379c816159af56a4e9c8a9760d3545dbb269d864))

### [5.0.3](https://github.com/nuxt-community/tailwindcss-module/compare/v5.0.2...v5.0.3) (2022-04-20)


### Bug Fixes

* tailwind viewer url ([#453](https://github.com/nuxt-community/tailwindcss-module/issues/453)) ([d35b39c](https://github.com/nuxt-community/tailwindcss-module/commit/d35b39c6b20a89f1005c383dff003137af0d5b66))

### [5.0.2](https://github.com/nuxt-community/tailwindcss-module/compare/v5.0.1...v5.0.2) (2022-03-16)


### Bug Fixes

* init postcss plugins (nuxt 2) and use default nesting config ([8afaf22](https://github.com/nuxt-community/tailwindcss-module/commit/8afaf22ab8ef9f4ea418630fd9b29fe04de59fea))

### [5.0.1](https://github.com/nuxt-community/tailwindcss-module/compare/v5.0.0...v5.0.1) (2022-03-15)


### Bug Fixes

* append to postcss options and use new nuxt 3 schema ([#437](https://github.com/nuxt-community/tailwindcss-module/issues/437)) ([fed1c31](https://github.com/nuxt-community/tailwindcss-module/commit/fed1c311a0b6ea4f7d37d5367ceedd2d36e84ab9))
* enable `postcss-nesting` by default ([bac29b4](https://github.com/nuxt-community/tailwindcss-module/commit/bac29b4c59acd06dc7a4ba6a7440105131de49c7))

## [5.0.0](https://github.com/nuxt-community/tailwindcss-module/compare/v5.0.0-4...v5.0.0) (2022-03-08)


### Bug Fixes

* add composables directory to content ([c36333a](https://github.com/nuxt-community/tailwindcss-module/commit/c36333a827af6c385a23647fb9bd381b69b8c77a))

## [5.0.0-4](https://github.com/nuxt-community/tailwindcss-module/compare/v5.0.0-3...v5.0.0-4) (2022-02-10)


### Bug Fixes

* import `tailwindcss/resolveConfig` with extension ([#426](https://github.com/nuxt-community/tailwindcss-module/issues/426)) ([d0aca40](https://github.com/nuxt-community/tailwindcss-module/commit/d0aca40e45c0854eae6affdd3a736ec44553c04e))

## [5.0.0-3](https://github.com/nuxt-community/tailwindcss-module/compare/v5.0.0-2...v5.0.0-3) (2022-02-08)


### Bug Fixes

* properly resolve `tailwind.config` (resolves [#425](https://github.com/nuxt-community/tailwindcss-module/issues/425)) ([7a7a5f6](https://github.com/nuxt-community/tailwindcss-module/commit/7a7a5f698f82d1c49360a41d6a4e9aa431aed0c1))

## [5.0.0-2](https://github.com/nuxt-community/tailwindcss-module/compare/v5.0.0-1...v5.0.0-2) (2022-02-08)


### Bug Fixes

* de-default tailwind-config-viewer import ([75ea329](https://github.com/nuxt-community/tailwindcss-module/commit/75ea329a6bd56137f2060255c453c136f3d5c069))

## [5.0.0-1](https://github.com/nuxt-community/tailwindcss-module/compare/v5.0.0-0...v5.0.0-1) (2022-02-08)

## [5.0.0-0](https://github.com/nuxt-community/tailwindcss-module/compare/v4.2.1...v5.0.0-0) (2022-02-08)


### ⚠ BREAKING CHANGES

* rewrite with module-builder and nuxt/kit (#419)

### Features

* add css inject position ([#381](https://github.com/nuxt-community/tailwindcss-module/issues/381)) ([4510784](https://github.com/nuxt-community/tailwindcss-module/commit/45107842bb08556b7383dd6b51cf74b6d2dd4a24))
* migrate to tailwind v3 ([#407](https://github.com/nuxt-community/tailwindcss-module/issues/407)) ([eacaa5e](https://github.com/nuxt-community/tailwindcss-module/commit/eacaa5e167887f729611f9cc6330e44df99c71c5))


* rewrite with module-builder and nuxt/kit ([#419](https://github.com/nuxt-community/tailwindcss-module/issues/419)) ([8ce8255](https://github.com/nuxt-community/tailwindcss-module/commit/8ce8255daa83f34361292e896dda6addca694587))

## [4.2.0](https://github.com/nuxt-community/tailwindcss-module/compare/v4.1.3...v4.2.0) (2021-06-22)


### Features

* set cssPath false to disable adding the CSS ([#362](https://github.com/nuxt-community/tailwindcss-module/issues/362)) ([695d068](https://github.com/nuxt-community/tailwindcss-module/commit/695d0681c2cabe64bcfd97968a0c9ddcb8ada98c))

### [4.1.3](https://github.com/nuxt-community/tailwindcss-module/compare/v4.1.2...v4.1.3) (2021-06-05)


### Bug Fixes

* add ts extension for purging components folder ([#356](https://github.com/nuxt-community/tailwindcss-module/issues/356)) ([8328c52](https://github.com/nuxt-community/tailwindcss-module/commit/8328c52b0a96c35fd117b0366e697b79ee1d741a))

### [4.1.2](https://github.com/nuxt-community/tailwindcss-module/compare/v4.1.1...v4.1.2) (2021-05-13)

### [4.1.1](https://github.com/nuxt-community/tailwindcss-module/compare/v4.1.0...v4.1.1) (2021-05-07)

## [4.1.0](https://github.com/nuxt-community/tailwindcss-module/compare/v4.0.3...v4.1.0) (2021-05-05)


### Features

* Update tailwind to 2.1 to natively support JIT ([#326](https://github.com/nuxt-community/tailwindcss-module/issues/326)) ([dfa989a](https://github.com/nuxt-community/tailwindcss-module/commit/dfa989a78ea444ebcc5357043848d4e034fe4b89))

### [4.0.3](https://github.com/nuxt-community/tailwindcss-module/compare/v4.0.2...v4.0.3) (2021-04-01)

### [4.0.2](https://github.com/nuxt-community/tailwindcss-module/compare/v4.0.1...v4.0.2) (2021-03-23)

### [4.0.1](https://github.com/nuxt-community/tailwindcss-module/compare/v4.0.0...v4.0.1) (2021-03-16)


### Bug Fixes

* use postcss-nesting instead ([6240fdf](https://github.com/nuxt-community/tailwindcss-module/commit/6240fdf331557f4b87a2580c545f3b49ce3faab5))

## [4.0.0](https://github.com/nuxt-community/tailwindcss-module/compare/v3.4.3...v4.0.0) (2021-03-15)


### ⚠ BREAKING CHANGES

* v4 (#287)

### Features

* v4 ([#287](https://github.com/nuxt-community/tailwindcss-module/issues/287)) ([15a86a9](https://github.com/nuxt-community/tailwindcss-module/commit/15a86a9628f9fb941ebe8a6eba62f3b6ab579b04)), closes [#270](https://github.com/nuxt-community/tailwindcss-module/issues/270) [#276](https://github.com/nuxt-community/tailwindcss-module/issues/276) [#288](https://github.com/nuxt-community/tailwindcss-module/issues/288)

## [4.0.0-12](https://github.com/nuxt-community/tailwindcss-module/compare/v4.0.0-11...v4.0.0-12) (2021-03-15)

## [4.0.0-11](https://github.com/nuxt-community/tailwindcss-module/compare/v4.0.0-10...v4.0.0-11) (2021-03-15)

## [4.0.0-10](https://github.com/nuxt-community/tailwindcss-module/compare/v4.0.0-9...v4.0.0-10) (2021-03-13)


### Bug Fixes

* revert to using object syntax ([a8d4acf](https://github.com/nuxt-community/tailwindcss-module/commit/a8d4acfd3ee60b14858f04a6af5d938276b1aa05))

## [4.0.0-9](https://github.com/nuxt-community/tailwindcss-module/compare/v4.0.0-8...v4.0.0-9) (2021-03-13)


### Bug Fixes

* dont expose config without option defined ([d98086e](https://github.com/nuxt-community/tailwindcss-module/commit/d98086e7db5e110891c0c2dd97dbc79d352cef9b))

## [4.0.0-8](https://github.com/nuxt-community/tailwindcss-module/compare/v4.0.0-7...v4.0.0-8) (2021-03-12)

## [4.0.0-7](https://github.com/nuxt-community/tailwindcss-module/compare/v4.0.0-5...v4.0.0-7) (2021-03-12)


### Features

* tailwind jit ([#288](https://github.com/nuxt-community/tailwindcss-module/issues/288)) ([24dc6c0](https://github.com/nuxt-community/tailwindcss-module/commit/24dc6c028f9399a58d2e1d73021a9f6532466775))

## [4.0.0-6](https://github.com/nuxt-community/tailwindcss-module/compare/v4.0.0-5...v4.0.0-6) (2021-03-12)


### Features

* tailwind jit ([#288](https://github.com/nuxt-community/tailwindcss-module/issues/288)) ([24dc6c0](https://github.com/nuxt-community/tailwindcss-module/commit/24dc6c028f9399a58d2e1d73021a9f6532466775))

## [4.0.0-5](https://github.com/nuxt-community/tailwindcss-module/compare/v3.4.3...v4.0.0-5) (2021-03-10)

## [4.0.0-4](https://github.com/nuxt-community/tailwindcss-module/compare/v4.0.0-3...v4.0.0-4) (2021-03-09)

## [4.0.0-3](https://github.com/nuxt-community/tailwindcss-module/compare/v4.0.0-2...v4.0.0-3) (2021-03-08)

## [4.0.0-2](https://github.com/nuxt-community/tailwindcss-module/compare/v4.0.0-1...v4.0.0-2) (2021-03-08)


### Bug Fixes

* use purge as object and force it to provide purge options ([910843f](https://github.com/nuxt-community/tailwindcss-module/commit/910843f10f6da538a261dfd7726ee82aeb6db6f1))

## [4.0.0-1](https://github.com/nuxt-community/tailwindcss-module/compare/v4.0.0-0...v4.0.0-1) (2021-03-08)

## [4.0.0-0](https://github.com/nuxt-community/tailwindcss-module/compare/v3.4.2...v4.0.0-0) (2021-03-05)


### ⚠ BREAKING CHANGES

* upgrade to tailwindcss@2 (#270)

### Features

* upgrade to tailwindcss@2 ([#270](https://github.com/nuxt-community/tailwindcss-module/issues/270)) ([8ab33b8](https://github.com/nuxt-community/tailwindcss-module/commit/8ab33b802005b80cd372e9a268e1c20ac8db8007))

### [3.4.3](https://github.com/nuxt-community/tailwindcss-module/compare/v3.4.2...v3.4.3) (2021-03-10)


### Bug Fixes

* use nuxt resolver to import `tailwind.config.js` ([#286](https://github.com/nuxt-community/tailwindcss-module/issues/286)) ([62526cf](https://github.com/nuxt-community/tailwindcss-module/commit/62526cf1af8319275dbf39f8d330063e661b1b50))

### [3.4.2](https://github.com/nuxt-community/tailwindcss-module/compare/v3.4.1...v3.4.2) (2020-12-22)

### [3.4.1](https://github.com/nuxt-community/tailwindcss-module/compare/v3.4.0...v3.4.1) (2020-12-18)


### Bug Fixes

* **middleware:** use cjs syntax ([#236](https://github.com/nuxt-community/tailwindcss-module/issues/236)) ([f35b1cc](https://github.com/nuxt-community/tailwindcss-module/commit/f35b1cc44dc9b3d1ff926b7d377d64c354b3697d))

## [3.4.0](https://github.com/nuxt-community/tailwindcss-module/compare/v3.3.4...v3.4.0) (2020-12-17)


### Features

* integrate tailwind-config-viewer ([#232](https://github.com/nuxt-community/tailwindcss-module/issues/232)) ([cc9fb3f](https://github.com/nuxt-community/tailwindcss-module/commit/cc9fb3f9b793fb7a3a931059ab20388130e137df))

### [3.3.4](https://github.com/nuxt-community/tailwindcss-module/compare/v3.3.3...v3.3.4) (2020-12-11)


### Bug Fixes

* addTemplate call compats low version nuxt ([#225](https://github.com/nuxt-community/tailwindcss-module/issues/225)) ([b18380d](https://github.com/nuxt-community/tailwindcss-module/commit/b18380dcd529d679314563f54f66dfe84556767c))

### [3.3.3](https://github.com/nuxt-community/tailwindcss-module/compare/v3.3.2...v3.3.3) (2020-12-04)

### [3.3.2](https://github.com/nuxt-community/tailwindcss-module/compare/v3.3.1...v3.3.2) (2020-12-04)


### Bug Fixes

* **lib:** check listeners value before ([431eafc](https://github.com/nuxt-community/tailwindcss-module/commit/431eafcce286317b0efdc1f4f7de303daaf672c9)), closes [#216](https://github.com/nuxt-community/tailwindcss-module/issues/216)

### [3.3.1](https://github.com/nuxt-community/tailwindcss-module/compare/v3.3.0...v3.3.1) (2020-12-03)


### Bug Fixes

* handle color as string and smarted light/dark detection ([6058ea8](https://github.com/nuxt-community/tailwindcss-module/commit/6058ea81021b2aee33ed3bb8a262352a3b35414a))

## [3.3.0](https://github.com/nuxt-community/tailwindcss-module/compare/v3.2.0...v3.3.0) (2020-12-02)


### Features

* add tailwind colors page ([#215](https://github.com/nuxt-community/tailwindcss-module/issues/215)) ([43db226](https://github.com/nuxt-community/tailwindcss-module/commit/43db226c51bd354ea54bd4638c9da882a1fb9442))

## [3.2.0](https://github.com/nuxt-community/tailwindcss-module/compare/v3.1.0...v3.2.0) (2020-10-22)


### Features

* use [@tailwind](https://github.com/tailwind) util ([#182](https://github.com/nuxt-community/tailwindcss-module/issues/182)) ([839b77c](https://github.com/nuxt-community/tailwindcss-module/commit/839b77c50b7a81c0214d953f19b8db3ba1e3fbc4))

## [3.1.0](https://github.com/nuxt-community/tailwindcss-module/compare/v3.0.2...v3.1.0) (2020-09-25)


### Features

* **purge:** handle custom srcDir and support TS ([#170](https://github.com/nuxt-community/tailwindcss-module/issues/170)) ([bf3e0db](https://github.com/nuxt-community/tailwindcss-module/commit/bf3e0db0b9188ad72a66ea98191583f19f979454))

### [3.0.2](https://github.com/nuxt-community/tailwindcss-module/compare/v3.0.1...v3.0.2) (2020-08-25)


### Bug Fixes

* handle HMR for tailwind config ([8c26472](https://github.com/nuxt-community/tailwindcss-module/commit/8c26472031d10400d829200fd6d65f0306ab442d)), closes [#157](https://github.com/nuxt-community/tailwindcss-module/issues/157)

### [3.0.1](https://github.com/nuxt-community/tailwindcss-module/compare/v3.0.0...v3.0.1) (2020-08-24)

## [3.0.0](https://github.com/nuxt-community/tailwindcss-module/compare/v2.1.1...v3.0.0) (2020-08-05)


### ⚠ BREAKING CHANGES

* ability to extend the Tailwind config (#133)

### Features

* ability to extend the Tailwind config ([#133](https://github.com/nuxt-community/tailwindcss-module/issues/133)) ([9d297b2](https://github.com/nuxt-community/tailwindcss-module/commit/9d297b22fc20b41fafe897ccfb21cd98ac66c1ce)), closes [#131](https://github.com/nuxt-community/tailwindcss-module/issues/131)

### [2.1.1](https://github.com/nuxt-community/tailwindcss-module/compare/v2.1.0...v2.1.1) (2020-07-29)

## [2.1.0](https://github.com/nuxt-community/tailwindcss-module/compare/v1.4.1...v2.1.0) (2020-07-20)


### Features

* use tailwind v1.4 and use purge option ([#95](https://github.com/nuxt-community/tailwindcss-module/issues/95)) ([09c0ee5](https://github.com/nuxt-community/tailwindcss-module/commit/09c0ee570c9e21c53864a1466f49552dc48a35c7))


### Bug Fixes

* force production env for postcss on nuxt build ([977d605](https://github.com/nuxt-community/tailwindcss-module/commit/977d605858891396c7a689cf545b85e4fc718b52))

### [1.4.1](https://github.com/nuxt-community/tailwindcss-module/compare/v1.4.0...v1.4.1) (2020-04-22)


### Bug Fixes

* eslint ([8963f19](https://github.com/nuxt-community/tailwindcss-module/commit/8963f19f3704e852cfa3eff884699484c0a8ca7e))
* keep only linux ([f43a6c9](https://github.com/nuxt-community/tailwindcss-module/commit/f43a6c9ea1bbc9324cf930d2789ead8afb537ab4))

## [1.2.0](https://github.com/nuxt-community/tailwindcss-module/compare/v1.1.2...v1.2.0) (2019-11-05)


### Features

* add support for deprecated build.postcss.plugins array syntax ([#36](https://github.com/nuxt-community/tailwindcss-module/issues/36)) ([6c3f550](https://github.com/nuxt-community/tailwindcss-module/commit/6c3f550))

### [1.1.2](https://github.com/nuxt-community/tailwindcss-module/compare/v1.1.1...v1.1.2) (2019-08-08)


### Bug Fixes

* upgrade tailwind and remove log ([c2a5798](https://github.com/nuxt-community/tailwindcss-module/commit/c2a5798))

### [1.1.1](https://github.com/nuxt-community/tailwindcss-module/compare/v1.1.0...v1.1.1) (2019-07-29)


### Bug Fixes

* changelog ([bc65736](https://github.com/nuxt-community/tailwindcss-module/commit/bc65736))



## [1.1.0](https://github.com/nuxt-community/tailwindcss-module/compare/v0.1.0...v1.1.0) (2019-06-12)


### Features

* refactor: module and increase coverage ([#5](https://github.com/nuxt-community/tailwindcss-module/issues/5)) ([43443c2](https://github.com/nuxt-community/tailwindcss-module/commit/43443c24524290602f9215fcb793e4ace7c75b5b))


### [1.0.0](https://github.com/Atinux/tailwindcss-module/compare/v0.1.1...v1.0.0) (2019-06-11)

### [0.1.1](https://github.com/Atinux/tailwindcss-module/compare/v0.1.0...v0.1.1) (2019-06-11)

* feat: config and css path options (#3)
* fix: use modules only for building and add logs
* feat: add cssPath and configPath options
* chore: update example
* chore: upgrade dependencies
* chore: add test

## [0.1.0](https://github.com/Atinux/tailwindcss-module/compare/v0.0.3...v0.1.0) (2019-06-06)


### Bug Fixes

* use correct links ([8b2cd7f](https://github.com/Atinux/tailwindcss-module/commit/8b2cd7f))


### Features

* use postcss preset 1 for nesting support ([e80dcc5](https://github.com/Atinux/tailwindcss-module/commit/e80dcc5))



### [0.0.4](https://github.com/Atinux/tailwindcss-module/compare/v0.0.3...v0.0.4) (2019-06-05)


### Bug Fixes

* use correct links ([7835051](https://github.com/Atinux/tailwindcss-module/commit/7835051))



## [0.0.2](https://github.com/Atinux/tailwindcss-module/compare/v0.0.1...v0.0.2) (2019-04-04)


### Bug Fixes

* **coverage:** Use handler for coverage ([1cd5a41](https://github.com/Atinux/tailwindcss-module/commit/1cd5a41))
* **esm:** Use CommonJS for performances ([6427e84](https://github.com/Atinux/tailwindcss-module/commit/6427e84))
* **package:** Fix url for GitHub ([889b742](https://github.com/Atinux/tailwindcss-module/commit/889b742))



## 0.0.1 (2019-04-04)


### Bug Fixes

* **purgeCSS:** Add tailwindCSS plugin before calling nuxt-purgecss ([0f1072d](https://github.com/nuxt-community/tailwindcss/commit/0f1072d))
