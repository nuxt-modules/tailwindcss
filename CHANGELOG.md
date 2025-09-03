# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## v7.0.0-beta.1

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v7.0.0-beta.0...v7.0.0-beta.1)

### 🩹 Fixes

- Use exsolve to resolve tailwind import ([cc9763a](https://github.com/nuxt-modules/tailwindcss/commit/cc9763a))
- **sources:** ⚠️  Provide sources as object ([255361d](https://github.com/nuxt-modules/tailwindcss/commit/255361d))

### 🏡 Chore

- Update deps without docs for now ([eda6389](https://github.com/nuxt-modules/tailwindcss/commit/eda6389))

#### ⚠️ Breaking Changes

- **sources:** ⚠️  Provide sources as object ([255361d](https://github.com/nuxt-modules/tailwindcss/commit/255361d))

## v7.0.0-beta.0

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v6.14.0...v7.0.0-beta.0)

### 🚀 Enhancements

- ⚠️  Update to Tailwind CSS v4 ([#991](https://github.com/nuxt-modules/tailwindcss/pull/991))

### 🩹 Fixes

- **docs:** Add iframe sandbox property as else COOP errors occur ([#988](https://github.com/nuxt-modules/tailwindcss/pull/988))

#### ⚠️ Breaking Changes

- ⚠️  Update to Tailwind CSS v4 ([#991](https://github.com/nuxt-modules/tailwindcss/pull/991))

### ❤️ Contributors

- Inesh Bose <dev@inesh.xyz>
- Chocolateimage <chocolateimage@protonmail.com>

## v6.14.0

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v6.13.2...v6.14.0)

### 🚀 Enhancements

- Add initial tw4 support in v6 ([#980](https://github.com/nuxt-modules/tailwindcss/pull/980))
- **defineConfig:** Enable conditional return ([#979](https://github.com/nuxt-modules/tailwindcss/pull/979))

### 🩹 Fixes

- Content resolution for [...path].vue pages ([#965](https://github.com/nuxt-modules/tailwindcss/pull/965))
- Try resolving `tailwindcss` from module ([#974](https://github.com/nuxt-modules/tailwindcss/pull/974))
- **config-hmr:** InteropDefault when importing config changes ([d3e4de7](https://github.com/nuxt-modules/tailwindcss/commit/d3e4de7))
- **content:** Move strict scanning to experimental ([75efd5c](https://github.com/nuxt-modules/tailwindcss/commit/75efd5c))
- **types:** Mark  as optional ([4a4af2c](https://github.com/nuxt-modules/tailwindcss/commit/4a4af2c))
- **content:** Spa-loading-template path with nuxt 4 app dir ([3f59d4a](https://github.com/nuxt-modules/tailwindcss/commit/3f59d4a))
- **content:** Revert pages to only app as layers also inherit it ([4eea740](https://github.com/nuxt-modules/tailwindcss/commit/4eea740))
- Only show Tailwind v4 warning when v4 is used ([#983](https://github.com/nuxt-modules/tailwindcss/pull/983), [#984](https://github.com/nuxt-modules/tailwindcss/pull/984))
- **defineConfig:** Pass cwd path to requireModule ([a0da2ee](https://github.com/nuxt-modules/tailwindcss/commit/a0da2ee))

### 💅 Refactors

- **proxy:** Use ohash diff to determine changes instead ([#985](https://github.com/nuxt-modules/tailwindcss/pull/985))

### 🏡 Chore

- Move kit back to explicit dependency ([#968](https://github.com/nuxt-modules/tailwindcss/pull/968))

### ❤️ Contributors

- Inesh Bose <dev@inesh.xyz>
- Connor Pearson ([@cjpearson](http://github.com/cjpearson))
- Daniel Roe ([@danielroe](http://github.com/danielroe))
- Juho Rutila ([@jrutila](http://github.com/jrutila))

## v6.13.2

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v6.13.1...v6.13.2)

### 🩹 Fixes

- **content:** Resolve `app/` dir for `utils`, resolves #955 ([#955](https://github.com/nuxt-modules/tailwindcss/issues/955))
- **content:** Use `pages:extend` to get page routes ([f226a64](https://github.com/nuxt-modules/tailwindcss/commit/f226a64))
- **config:** Dedupe `tailwind.config` from configPaths, closes #949 ([#949](https://github.com/nuxt-modules/tailwindcss/issues/949))

### 📖 Documentation

- Mention `tailwindcss-cli` if `tailwindcss init` fails ([#946](https://github.com/nuxt-modules/tailwindcss/pull/946))
- Direct to v3 tailwindcss docs ([a7c54c4](https://github.com/nuxt-modules/tailwindcss/commit/a7c54c4))
- Revert to NuxtTailwind ([#963](https://github.com/nuxt-modules/tailwindcss/pull/963))
- Update module-options.md ([159ab53](https://github.com/nuxt-modules/tailwindcss/commit/159ab53))

### 🏡 Chore

- **ci:** Fix corepack for actions/setup-node ([c996f0a](https://github.com/nuxt-modules/tailwindcss/commit/c996f0a))
- Fix lint ([3dd3ada](https://github.com/nuxt-modules/tailwindcss/commit/3dd3ada))

### ❤️ Contributors

- Inesh Bose <dev@inesh.xyz>
- David Marr ([@marr](http://github.com/marr))
- Ditmar Entwicklerberg ([@entwicklerberg](http://github.com/entwicklerberg))
- Dev By Ray ([@devbyray](http://github.com/devbyray))

## v6.13.1

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v6.13.0...v6.13.1)

### 🩹 Fixes

- Check for non-resolved tailwind.config ([c448158](https://github.com/nuxt-modules/tailwindcss/commit/c448158))

### ❤️ Contributors

- Inesh Bose <dev@inesh.xyz>

## v6.13.0

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v6.12.2...v6.13.0)

### 🚀 Enhancements

- **content:** Add `spaLoadingTemplate` to content resolution ([#907](https://github.com/nuxt-modules/tailwindcss/pull/907))
- Enable c12 for loading config and provide `defineConfig` ([#913](https://github.com/nuxt-modules/tailwindcss/pull/913))
- **merger:** Add to exports ([#922](https://github.com/nuxt-modules/tailwindcss/pull/922))

### 🩹 Fixes

- **hmr:** Fix variable ([f47e093](https://github.com/nuxt-modules/tailwindcss/commit/f47e093))
- **load:** Add .js to tailwindcss/resolveConfig ([0696aba](https://github.com/nuxt-modules/tailwindcss/commit/0696aba))
- **config:** Use mjs template ([#930](https://github.com/nuxt-modules/tailwindcss/pull/930))
- **injectPosition:** Resolve file paths to determine position ([71be9ac](https://github.com/nuxt-modules/tailwindcss/commit/71be9ac))

### 📖 Documentation

- Add command to create tailwind.config.js for pnpm ([#910](https://github.com/nuxt-modules/tailwindcss/pull/910))
- Provide GitHub link for examples ([#904](https://github.com/nuxt-modules/tailwindcss/pull/904))
- Update outdated content ([#937](https://github.com/nuxt-modules/tailwindcss/pull/937))

### 🏡 Chore

- Update dependencies ([#917](https://github.com/nuxt-modules/tailwindcss/pull/917))
- Update deps ([2077e60](https://github.com/nuxt-modules/tailwindcss/commit/2077e60))
- Update resolveContentConfig a bit and viewer logging ([#931](https://github.com/nuxt-modules/tailwindcss/pull/931))
- Update deps ([3ff6d76](https://github.com/nuxt-modules/tailwindcss/commit/3ff6d76))

### ❤️ Contributors

- Inesh Bose <dev@inesh.xyz>
- John Farrar ([@sosensible](http://github.com/sosensible))
- Dereck Lam Hon Wah ([@derecklhw](http://github.com/derecklhw))
- Nikolasdas ([@nikolasdas](http://github.com/nikolasdas))

## v6.12.2

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v6.12.1...v6.12.2)

### 🩹 Fixes

- #883 Tab view src leading baseURL ([#885](https://github.com/nuxt-modules/tailwindcss/pull/885), [#883](https://github.com/nuxt-modules/tailwindcss/issues/883))
- **viewer:** Provide workaround for nuxt2 `modules:done` serverMiddleware race condition ([9d42549](https://github.com/nuxt-modules/tailwindcss/commit/9d42549))

### 📖 Documentation

- Mention tailwind intelliSense integration with IDEs pointing to tailwind  docs  / editor config ([#875](https://github.com/nuxt-modules/tailwindcss/pull/875))

### 🏡 Chore

- Use klona and content configuration as object ([f606398](https://github.com/nuxt-modules/tailwindcss/commit/f606398))
- Fix test and provide toggle ([60a4bba](https://github.com/nuxt-modules/tailwindcss/commit/60a4bba))
- Update docs and add examples test ci ([#853](https://github.com/nuxt-modules/tailwindcss/pull/853))
- Update deps ([#900](https://github.com/nuxt-modules/tailwindcss/pull/900))
- Indicate compatibility with new v4 major ([#876](https://github.com/nuxt-modules/tailwindcss/pull/876))
- Update test ([2d051e2](https://github.com/nuxt-modules/tailwindcss/commit/2d051e2))
- Remove console output testing ([98296a8](https://github.com/nuxt-modules/tailwindcss/commit/98296a8))
- Fix lint ([a7b886a](https://github.com/nuxt-modules/tailwindcss/commit/a7b886a))

### ❤️ Contributors

- Inesh Bose <dev@inesh.xyz>
- Daniel Roe ([@danielroe](http://github.com/danielroe))
- Santiago A. ([@santiagoaloi](http://github.com/santiagoaloi))
- Richardev ([@richardevcom](http://github.com/richardevcom))

## v6.12.1

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v6.12.0...v6.12.1)

### 🩹 Fixes

- Better check for unsafe config to fallback ([#839](https://github.com/nuxt-modules/tailwindcss/pull/839))
- Safer checking for templates, closes #860 and closes #865 ([#860](https://github.com/nuxt-modules/tailwindcss/issues/860), [#865](https://github.com/nuxt-modules/tailwindcss/issues/865))

### 📖 Documentation

- Polish homepage and logo ([9977f25](https://github.com/nuxt-modules/tailwindcss/commit/9977f25))
- Update examples, closes #841 ([#841](https://github.com/nuxt-modules/tailwindcss/issues/841))
- Fix injectPosition typo ([#859](https://github.com/nuxt-modules/tailwindcss/pull/859))
- Prerender `/` ([427cfb5](https://github.com/nuxt-modules/tailwindcss/commit/427cfb5))
- Revert logo ([#873](https://github.com/nuxt-modules/tailwindcss/pull/873))

### 📦 Build

- Update merger filename and revert `@nuxt/content` upgrade ([#867](https://github.com/nuxt-modules/tailwindcss/pull/867))

### 🏡 Chore

- Update to latest `@nuxt/module-builder` ([#840](https://github.com/nuxt-modules/tailwindcss/pull/840))
- Update renovate config ([#844](https://github.com/nuxt-modules/tailwindcss/pull/844))
- Bump `nuxt-component-meta` ([63a8a8e](https://github.com/nuxt-modules/tailwindcss/commit/63a8a8e))
- **ci:** Fix test ([71f00b6](https://github.com/nuxt-modules/tailwindcss/commit/71f00b6))
- **ci:** Fix test ([7704e81](https://github.com/nuxt-modules/tailwindcss/commit/7704e81))
- Update deps ([a219ef1](https://github.com/nuxt-modules/tailwindcss/commit/a219ef1))
- **builder:** Specify merger as entry ([2f1c09d](https://github.com/nuxt-modules/tailwindcss/commit/2f1c09d))
- **ci:** Fix ([2679f27](https://github.com/nuxt-modules/tailwindcss/commit/2679f27))
- Bump `mkdist` in lockfile ([36febad](https://github.com/nuxt-modules/tailwindcss/commit/36febad))
- Fix lint ([d11f4f2](https://github.com/nuxt-modules/tailwindcss/commit/d11f4f2))

### ❤️ Contributors

- Inesh Bose <dev@inesh.xyz>
- Benjamin Canac ([@benjamincanac](http://github.com/benjamincanac))
- Daniel Roe ([@danielroe](http://github.com/danielroe))
- M0nch1 ([@m0nch1](http://github.com/m0nch1))
- Gangan ([@shinGangan](http://github.com/shinGangan))

## v6.12.0

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v6.11.4...v6.12.0)

### 🚀 Enhancements

- First class hmr ([#818](https://github.com/nuxt-modules/tailwindcss/pull/818))

### 💅 Refactors

- First class HMR support ([#795](https://github.com/nuxt-modules/tailwindcss/pull/795))
- First class HMR support " ([#795](https://github.com/nuxt-modules/tailwindcss/pull/795), [#817](https://github.com/nuxt-modules/tailwindcss/pull/817))

### 📖 Documentation

- Update configuration docs ([#827](https://github.com/nuxt-modules/tailwindcss/pull/827))
- Use new `nuxi module add` command in installation ([#829](https://github.com/nuxt-modules/tailwindcss/pull/829))
- Update classRegex, closes #824 ([#824](https://github.com/nuxt-modules/tailwindcss/issues/824))

### 🏡 Chore

- Remove unneeded postcss-custom-properties plugin ([#836](https://github.com/nuxt-modules/tailwindcss/pull/836))
- Migrate to eslint v9 ([#834](https://github.com/nuxt-modules/tailwindcss/pull/834))
- Update deps ([87fb919](https://github.com/nuxt-modules/tailwindcss/commit/87fb919))

### ❤️ Contributors

- Inesh Bose <dev@inesh.xyz>
- Daniel Roe ([@danielroe](http://github.com/danielroe))
- Scott Rees ([@reesscot](http://github.com/reesscot))
- Selemondev ([@selemondev](http://github.com/selemondev))

## v6.11.4

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v6.11.3...v6.11.4)

### 🩹 Fixes

- Null check for plugins ([8a3b46d](https://github.com/nuxt-modules/tailwindcss/commit/8a3b46d))

### 💅 Refactors

- Move `colorette` to `consola/utils` ([#805](https://github.com/nuxt-modules/tailwindcss/pull/805))

### 🏡 Chore

- Assign postcss plugins in order ([46c2025](https://github.com/nuxt-modules/tailwindcss/commit/46c2025))

### ❤️ Contributors

- Inesh Bose <dev@inesh.xyz>
- Haruaki OTAKE <aaharu@hotmail.com>

## v6.11.3

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v6.11.2...v6.11.3)

### 🩹 Fixes

- Add tw util for compatible versions and use unshift for module paths ([3f0d6e1](https://github.com/nuxt-modules/tailwindcss/commit/3f0d6e1))
- Command palette ([#799](https://github.com/nuxt-modules/tailwindcss/pull/799))

### 📖 Documentation

- Add export default to default config example ([#796](https://github.com/nuxt-modules/tailwindcss/pull/796))

### ❤️ Contributors

- Florent Delerue <florentdelerue@hotmail.com>
- Inesh Bose <dev@inesh.xyz>
- Johannes Przymusinski ([@cngJo](http://github.com/cngJo))

## v6.11.2

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v6.11.1...v6.11.2)

### 🩹 Fixes

- **viewer:** Handle redirect and callback await, thank you danielroe :) ([734ef1c](https://github.com/nuxt-modules/tailwindcss/commit/734ef1c))

### 📖 Documentation

- Fix paths for build ([5971b0a](https://github.com/nuxt-modules/tailwindcss/commit/5971b0a))

### ❤️ Contributors

- Inesh Bose <dev@inesh.xyz>

## v6.11.1

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v6.11.0...v6.11.1)

### 🩹 Fixes

- **resolvers:** Respect configPath over layers ([c7fe392](https://github.com/nuxt-modules/tailwindcss/commit/c7fe392))

### ❤️ Contributors

- Inesh Bose

## v6.11.0

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v6.10.4...v6.11.0)

### 🚀 Enhancements

- `editorSupport` option ([#784](https://github.com/nuxt-modules/tailwindcss/pull/784))

### 🩹 Fixes

- **nightly-ci:** Specify from flag to changelogen ([ef74d1f](https://github.com/nuxt-modules/tailwindcss/commit/ef74d1f))
- **nightly-ci:** Fetch-depth 0 ([4f539d0](https://github.com/nuxt-modules/tailwindcss/commit/4f539d0))
- **nightly-ci:** Run build directly ([e90ea72](https://github.com/nuxt-modules/tailwindcss/commit/e90ea72))
- Fix prepare command ([f369792](https://github.com/nuxt-modules/tailwindcss/commit/f369792))

### 💅 Refactors

- Move `injectPosition` to `cssPath` ([#792](https://github.com/nuxt-modules/tailwindcss/pull/792))

### 🏡 Chore

- Update dependencies, closes #789 ([#789](https://github.com/nuxt-modules/tailwindcss/issues/789))
- Update dependencies ([1e372fd](https://github.com/nuxt-modules/tailwindcss/commit/1e372fd))
- Add config warnings ([d8e36e9](https://github.com/nuxt-modules/tailwindcss/commit/d8e36e9))
- **exposeConfig:** Provide write option for workaround, resolves #794 ([#794](https://github.com/nuxt-modules/tailwindcss/issues/794))
- Update readme ([281df61](https://github.com/nuxt-modules/tailwindcss/commit/281df61))
- Update ([8cf0a04](https://github.com/nuxt-modules/tailwindcss/commit/8cf0a04))
- Specify prepublishOnly script ([2bca37a](https://github.com/nuxt-modules/tailwindcss/commit/2bca37a))
- Fix lint ([eab2fb4](https://github.com/nuxt-modules/tailwindcss/commit/eab2fb4))
- **release:** V6.12.0 ([9837fb8](https://github.com/nuxt-modules/tailwindcss/commit/9837fb8))
- **release:** V6.12.1 ([320dacf](https://github.com/nuxt-modules/tailwindcss/commit/320dacf))

### ❤️ Contributors

- Inesh Bose <dev@inesh.xyz>

## v6.10.4

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v6.10.3...v6.10.4)

### 🩹 Fixes

- **viewer:** Trust listener url for baseURL, closes #782 ([#782](https://github.com/nuxt-modules/tailwindcss/issues/782))

### 📖 Documentation

- Fix defaultTheme.colors.green is undefined ([#788](https://github.com/nuxt-modules/tailwindcss/pull/788))

### 🏡 Chore

- **ci:** Apply some automated fixes ([abc03df](https://github.com/nuxt-modules/tailwindcss/commit/abc03df))
- **ci:** Keep sink skip ([e808d1f](https://github.com/nuxt-modules/tailwindcss/commit/e808d1f))
- Update deps ([46ef08a](https://github.com/nuxt-modules/tailwindcss/commit/46ef08a))
- **ci:** Fix vue to 2.7.15 ([1a8100b](https://github.com/nuxt-modules/tailwindcss/commit/1a8100b))
- Update deps ([14989c4](https://github.com/nuxt-modules/tailwindcss/commit/14989c4))

### ❤️ Contributors

- Inesh Bose 
- Isaac Qadri

## v6.10.3

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v6.10.2...v6.10.3)

### 🩹 Fixes

- Remove postinstall script ([132f5a1](https://github.com/nuxt-modules/tailwindcss/commit/132f5a1))

### ❤️ Contributors

- Sébastien Chopin ([@Atinux](http://github.com/Atinux))

## v6.10.2

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v6.10.1...v6.10.2)

### 🩹 Fixes

- **nightly-ci:** Apply some fixes for nightly releases ([6cc7ae3](https://github.com/nuxt-modules/tailwindcss/commit/6cc7ae3))
- **nightly-ci:** Provide id-token permission ([32cd19e](https://github.com/nuxt-modules/tailwindcss/commit/32cd19e))
- **types:** Allow ResolvedTWConfig in templates ([228324e](https://github.com/nuxt-modules/tailwindcss/commit/228324e))

### 🏡 Chore

- Use module-builder stub mode for more accurate types ([#773](https://github.com/nuxt-modules/tailwindcss/pull/773))
- Update repo ([#768](https://github.com/nuxt-modules/tailwindcss/pull/768))
- Update tailwindcss to 3.4 ([#779](https://github.com/nuxt-modules/tailwindcss/pull/779))
- Test bundler module resolution ([c207562](https://github.com/nuxt-modules/tailwindcss/commit/c207562))

### ❤️ Contributors

- Inesh Bose <dev@inesh.xyz>
- Nathanjcollins 
- Daniel Roe <daniel@roe.dev>

## v6.10.1

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v6.10.0...v6.10.1)

### 🏡 Chore

- Remove @nuxt/postcss8 ([#767](https://github.com/nuxt-modules/tailwindcss/pull/767))
- Remove tsconfig from playgroun ([603f214](https://github.com/nuxt-modules/tailwindcss/commit/603f214))
- Update gitignore ([931d479](https://github.com/nuxt-modules/tailwindcss/commit/931d479))

### ❤️ Contributors

- Sébastien Chopin ([@Atinux](http://github.com/Atinux))
- Inesh Bose <dev@inesh.xyz>

## v6.10.0

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v6.9.5...v6.10.0)

### 🚀 Enhancements

- Add util to write tw classes inside strings ([#761](https://github.com/nuxt-modules/tailwindcss/pull/761))
- Quiet mode with logger config ([#759](https://github.com/nuxt-modules/tailwindcss/pull/759))

### 📖 Documentation

- Move to UI Pro ([#763](https://github.com/nuxt-modules/tailwindcss/pull/763))
- Remove emoji ([a697b99](https://github.com/nuxt-modules/tailwindcss/commit/a697b99))
- Remove tailwind link on header ([ca22728](https://github.com/nuxt-modules/tailwindcss/commit/ca22728))
- Fix edit link ([15da124](https://github.com/nuxt-modules/tailwindcss/commit/15da124))

### 🏡 Chore

- Update docs ([2632195](https://github.com/nuxt-modules/tailwindcss/commit/2632195))
- Fix protocol slash on tailwind viewer logger ([#765](https://github.com/nuxt-modules/tailwindcss/pull/765))
- Update deps & lint fix ([d6111cd](https://github.com/nuxt-modules/tailwindcss/commit/d6111cd))

### ❤️ Contributors

- Sébastien Chopin ([@Atinux](http://github.com/Atinux))
- Daniel Acuña 
- Carles Mitjans <carles.mitjans.coma@gmail.com>
- Rgehbt 
- Inesh Bose

## v6.9.5

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v6.9.4...v6.9.5)

### 🩹 Fixes

- **compat:** Unspecify bridge option to undefined ([58abedf](https://github.com/nuxt-modules/tailwindcss/commit/58abedf))

### 🏡 Chore

- Implement fixes on viewer and allow exporting ([#754](https://github.com/nuxt-modules/tailwindcss/pull/754))

### ❤️ Contributors

- Inesh Bose <boseinesh@gmail.com>

## v6.9.4

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v6.9.3...v6.9.4)

### 🩹 Fixes

- Always include vue extension in SFC content paths ([#752](https://github.com/nuxt-modules/tailwindcss/pull/752))

### ❤️ Contributors

- Connor Pearson <connor.pearson@aboutyou.com>

## v6.9.3

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v6.9.2...v6.9.3)

### 🩹 Fixes

- Allow options.imports to not be set ([#751](https://github.com/nuxt-modules/tailwindcss/pull/751))

### ❤️ Contributors

- Connor Pearson <cjp822@gmail.com>

## v6.9.2

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v6.9.1...v6.9.2)

### 🩹 Fixes

- Include components in content ([#750](https://github.com/nuxt-modules/tailwindcss/pull/750))

### ❤️ Contributors

- Inesh Bose

## v6.9.1

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v6.9.0...v6.9.1)

### 🩹 Fixes

- Exclude modules from content ([#748](https://github.com/nuxt-modules/tailwindcss/pull/748))
- Allow nuxt.options.pages to be unset ([#747](https://github.com/nuxt-modules/tailwindcss/pull/747))

### ❤️ Contributors

- Maddy <maddy@kitty.garden>
- Inesh Bose

## v6.9.0

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v6.8.1...v6.9.0)

### 🚀 Enhancements

- More adaptive content paths ([#744](https://github.com/nuxt-modules/tailwindcss/pull/744))
- More customisable configuration ([#743](https://github.com/nuxt-modules/tailwindcss/pull/743))

### 🏡 Chore

- Add type module to packageJson ([36b4766](https://github.com/nuxt-modules/tailwindcss/commit/36b4766))

### ❤️ Contributors

- Inesh Bose

## v6.8.1

[compare changes](https://github.com/nuxt-modules/tailwindcss/compare/v6.8.0...v6.8.1)

### 🩹 Fixes

- Typeof import default in dts ([4334ea3](https://github.com/nuxt-modules/tailwindcss/commit/4334ea3))
- Not require bridge ([c488680](https://github.com/nuxt-modules/tailwindcss/commit/c488680))
- **docs:** Closes #705 ([#705](https://github.com/nuxt-modules/tailwindcss/issues/705))
- **ci:** Attempt to fix test ([23233be](https://github.com/nuxt-modules/tailwindcss/commit/23233be))
- **ci:** Attempt to fix test ([6eb2b07](https://github.com/nuxt-modules/tailwindcss/commit/6eb2b07))
- Add types to package.json exports map ([#724](https://github.com/nuxt-modules/tailwindcss/pull/724))
- **ci:** Lock vitest version ([#738](https://github.com/nuxt-modules/tailwindcss/pull/738))
- Resolve tailwindcss/tailwind.css with pnpm and no shamefully hoist ([#740](https://github.com/nuxt-modules/tailwindcss/pull/740))

### 📖 Documentation

- Update dark mode ([a1b8fa2](https://github.com/nuxt-modules/tailwindcss/commit/a1b8fa2))
- Improve homepage ([c801b82](https://github.com/nuxt-modules/tailwindcss/commit/c801b82))
- Update og image ([1825f44](https://github.com/nuxt-modules/tailwindcss/commit/1825f44))
- Full url for ogImage ([f00a1c6](https://github.com/nuxt-modules/tailwindcss/commit/f00a1c6))
- Update design ([8763358](https://github.com/nuxt-modules/tailwindcss/commit/8763358))
- Add command to create tailwind.config file ([0458188](https://github.com/nuxt-modules/tailwindcss/commit/0458188))
- Fix typo ([#720](https://github.com/nuxt-modules/tailwindcss/pull/720))
- Rename `NuxtLabs UI` to `Nuxt UI` ([#723](https://github.com/nuxt-modules/tailwindcss/pull/723))
- Update SB embed ([8ec24ca](https://github.com/nuxt-modules/tailwindcss/commit/8ec24ca))

### 🏡 Chore

- Using nuxt convention for indexing type ([da4f9d3](https://github.com/nuxt-modules/tailwindcss/commit/da4f9d3))
- Update docs ([20d7922](https://github.com/nuxt-modules/tailwindcss/commit/20d7922))
- Update lock ([80c2718](https://github.com/nuxt-modules/tailwindcss/commit/80c2718))
- Update ci.yml ([fa82937](https://github.com/nuxt-modules/tailwindcss/commit/fa82937))
- Revert change ([43234be](https://github.com/nuxt-modules/tailwindcss/commit/43234be))
- Remove duplicate / on tailwind viewer ([aa75b79](https://github.com/nuxt-modules/tailwindcss/commit/aa75b79))
- Fix vitest version ([b4ac533](https://github.com/nuxt-modules/tailwindcss/commit/b4ac533))
- Ignore vitest in renovate ([1eb0913](https://github.com/nuxt-modules/tailwindcss/commit/1eb0913))
- Update deps ([77958b8](https://github.com/nuxt-modules/tailwindcss/commit/77958b8))
- Revert vitest version ([d189d8f](https://github.com/nuxt-modules/tailwindcss/commit/d189d8f))

### ❤️ Contributors

- Inesh Bose <2504266b@student.gla.ac.uk>
- Sébastien Chopin ([@Atinux](http://github.com/Atinux))
- Stefanprobst <stefanprobst@posteo.de>
- Benjamin Canac ([@benjamincanac](http://github.com/benjamincanac))
- Tech Genius

## v6.8.0

[compare changes](https://undefined/undefined/compare/v6.7.2...v6.8.0)


### 🚀 Enhancements

  - Parallelise async calls and fixes (#690)

### 📖 Documentation

  - No strict peer (582cb73)
  - Use SB for example (9b157eb)
  - Update color mode example (255da81)
  - Update examples (43b224d)

### 🏡 Chore

  - Update deps (9bf0e68)

### ❤️  Contributors

- Sébastien Chopin ([@Atinux](http://github.com/Atinux))
- Inesh Bose

## v6.7.2

[compare changes](https://undefined/undefined/compare/v6.7.1...v6.7.2)


### 🔥 Performance

  - Parallelise all async calls " (#679)

### 📖 Documentation

  - Update deps (5a877b9)

### ❤️  Contributors

- Sébastien Chopin ([@Atinux](http://github.com/Atinux))

## v6.7.1

[compare changes](https://undefined/undefined/compare/v6.7.0...v6.7.1)


### 🔥 Performance

  - Parallelise all async calls (#679)

### 🏡 Chore

  - Upgrade deps (de99ac0)

### ❤️  Contributors

- Sébastien Chopin ([@Atinux](http://github.com/Atinux))
- Inesh Bose

## v6.7.0

[compare changes](https://undefined/undefined/compare/v6.6.8...v6.7.0)


### 🚀 Enhancements

  - Allow content as object (#674)

### 🩹 Fixes

  - **vite-plugin:** Consider content as object (#672)
  - SrcDir for layers (#676)

### 📖 Documentation

  - Mention plugins in editor support (#675)

### 🏡 Chore

  - Update h3 (84177fe)

### ❤️  Contributors

- Sébastien Chopin ([@Atinux](http://github.com/Atinux))
- Inesh Bose

## v6.6.8

[compare changes](https://undefined/undefined/compare/v6.6.7...v6.6.8)


### 🩹 Fixes

  - No longer generate .nuxt/tailwind.config.cjs (#660)
  - Minimatch bug and move to @nuxt/eslint-config (f536b0d)

### 📖 Documentation

  - Content overriding with test files (#670)

### 🏡 Chore

  - Fix ts error (093df69)
  - Update deps (e56394b)

### ❤️  Contributors

- Sébastien Chopin ([@Atinux](http://github.com/Atinux))
- Inesh Bose 
- Pascal Sthamer

## v6.6.7

[compare changes](https://undefined/undefined/compare/v6.6.6...v6.6.7)


### 🏡 Chore

  - Upgrade deps (cb92551)
  - Exclude test files and add app.config to Tailwind content (#662)
  - Update deps (fcdbae1)

### ✅ Tests

  - Fix test (#665)

### ❤️  Contributors

- Sébastien Chopin ([@Atinux](http://github.com/Atinux))
- Anthony Fu <anthonyfu117@hotmail.com>
- Maarten Van Hunsel

## v6.6.6

[compare changes](https://undefined/undefined/compare/v6.6.5...v6.6.6)


### 🩹 Fixes

  - Viewer on Nuxt 2 (#658)

### 🏡 Chore

  - **module:** Call hook before resolving config (#655)
  - Add back viewer in playground (9f7e991)

### ❤️  Contributors

- Sébastien Chopin ([@Atinux](http://github.com/Atinux))
- Benjamin Canac ([@benjamincanac](http://github.com/benjamincanac))
- Asc0910

## v6.6.5

[compare changes](https://undefined/undefined/compare/v6.6.4...v6.6.5)


### 🩹 Fixes

  - Typeof import default in dts (#647)

### 🏡 Chore

  - Update pnpm lockfile (2d0b967)
  - Update repo url (3c8990a)

### ❤️  Contributors

- Daniel Roe <daniel@roe.dev>
- Inesh Bose

## v6.6.4

[compare changes](https://undefined/undefined/compare/v6.6.3...v6.6.4)


### 🩹 Fixes

  - Use file extension (for esm support) and add missing deps (#644)

### ❤️  Contributors

- Daniel Roe <daniel@roe.dev>

## v6.6.3

[compare changes](https://undefined/undefined/compare/v6.6.2...v6.6.3)


### 🏡 Chore

  - Using tw default config " (#636)

### ❤️  Contributors

- Sébastien Chopin ([@Atinux](http://github.com/Atinux))

## v6.6.2

[compare changes](https://undefined/undefined/compare/v6.6.1...v6.6.2)


### 📖 Documentation

  - Update README.md (f4bc8b3)

### 🏡 Chore

  - Using tw default config (#636)

### ❤️  Contributors

- Inesh Bose 
- Sébastien Chopin <seb@nuxtjs.com>

## v6.6.1

[compare changes](https://undefined/undefined/compare/v6.6.0...v6.6.1)


### 🏡 Chore

  - Reducing dependencies (#634)
  - Update readme (#640)
  - Move heavy populateMap function to utils (#637)
  - Add `utils` to default content path (#641)
  - Improving types for config (#635)

### ❤️  Contributors

- Inesh Bose 
- Alexander Lichter <manniL@gmx.net>

## v6.6.0

[compare changes](https://undefined/undefined/compare/v6.5.0...v6.6.0)


### 🚀 Enhancements

  - Restart Nuxt server on config changes (#624)

### 🩹 Fixes

  - **exposeConfig:** Maximize nested exports (#629)

### 📖 Documentation

  - Move to pnpm (abb41a9)
  - Improvements (45ef77c)
  - Improvements (7c4561f)

### 🏡 Chore

  - **ts:** Add types (4a9f68b)

### ❤️  Contributors

- Sébastien Chopin ([@Atinux](http://github.com/Atinux))
- Inesh Bose

## v6.5.0

[compare changes](https://undefined/undefined/compare/v6.4.1...v6.5.0)


### 🚀 Enhancements

  - Providing types for all exports (#617)

### 🩹 Fixes

  - Don't add tailwind viewer in devtools if disabled (1734058)
  - Set preset plugins to null in resolved config (#618)

### 📖 Documentation

  - Add nuxt badge (294759a)
  - Simplify badge logo (9ee9c66)
  - Link updated (#625)
  - Update config hook (ccbd473)

### 🏡 Chore

  - Update lock (c0ce982)
  - Switch to pnpm and changelogen (8677739)
  - Update commands (c901389)

### ❤️  Contributors

- Sébastien Chopin ([@Atinux](http://github.com/Atinux))
- Tim Morris ([@tkofh](http://github.com/tkofh))
- Inesh Bose 
- Zack Hatlen ([@zackha](http://github.com/zackha))

### [6.4.1](https://github.com/nuxt-modules/tailwindcss/compare/v6.4.0...v6.4.1) (2023-02-17)


### Bug Fixes

* nested props resolution ([#616](https://github.com/nuxt-modules/tailwindcss/issues/616)) ([aa314fb](https://github.com/nuxt-modules/tailwindcss/commit/aa314fb2b6da29769ccbd6f60b1d253d08c2a3c0))

## [6.4.0](https://github.com/nuxt-modules/tailwindcss/compare/v6.3.1...v6.4.0) (2023-02-11)


### Features

* Adding Tailwind Viewer to Nuxt dev tools ([#612](https://github.com/nuxt-modules/tailwindcss/issues/612)) ([c46c834](https://github.com/nuxt-modules/tailwindcss/commit/c46c8346d5098f46181dd6eb7af305b8cb3a3e89))


### Bug Fixes

* support nuxt 2.16+ ([#611](https://github.com/nuxt-modules/tailwindcss/issues/611)) ([0c5e073](https://github.com/nuxt-modules/tailwindcss/commit/0c5e073932ecef5dce7922e6ab2e93555870b53d))

### [6.3.1](https://github.com/nuxt-modules/tailwindcss/compare/v6.3.0...v6.3.1) (2023-02-01)


### Bug Fixes

* support layers in correct order and watch config to warn restart ([0357676](https://github.com/nuxt-modules/tailwindcss/commit/0357676c76d192d4ac2ae5ad5eed1d3ca7709afd))

## [6.3.0](https://github.com/nuxt-modules/tailwindcss/compare/v6.2.0...v6.3.0) (2023-01-25)


### Features

* **exposeConfig:** nested properties ([#583](https://github.com/nuxt-modules/tailwindcss/issues/583)) ([e88c23a](https://github.com/nuxt-modules/tailwindcss/commit/e88c23ab6237d69450617773bd75e8fdd3402bfd))


### Bug Fixes

* considered content as function ([#592](https://github.com/nuxt-modules/tailwindcss/issues/592)) ([cf67d89](https://github.com/nuxt-modules/tailwindcss/commit/cf67d892914ff6b38c7740aaa585d4ad93f6fba6))
* css intellisense not working ([#596](https://github.com/nuxt-modules/tailwindcss/issues/596)) ([de81e7d](https://github.com/nuxt-modules/tailwindcss/commit/de81e7d7bca9a70eabca1e23c23c6302334fe758)), closes [#593](https://github.com/nuxt-modules/tailwindcss/issues/593)

## [6.2.0](https://github.com/nuxt-modules/tailwindcss/compare/v6.1.3...v6.2.0) (2022-12-19)


### Features

* **docs:** upgrade to latest Docus ([#580](https://github.com/nuxt-modules/tailwindcss/issues/580)) ([462410a](https://github.com/nuxt-modules/tailwindcss/commit/462410a246edae25ccfe38f0bb2f6f47a626dc04))


### Bug Fixes

* **exposeConfig:** named exports in mjs for tree-shaking ([#582](https://github.com/nuxt-modules/tailwindcss/issues/582)) ([6c3168d](https://github.com/nuxt-modules/tailwindcss/commit/6c3168da0bf59f15e3a53eaacb1abd382b62206e))

### [6.1.3](https://github.com/nuxt-modules/tailwindcss/compare/v6.1.2...v6.1.3) (2022-11-03)


### Bug Fixes

* css option in  object format error. ([#557](https://github.com/nuxt-modules/tailwindcss/issues/557)) ([2408a1e](https://github.com/nuxt-modules/tailwindcss/commit/2408a1edcac909bf29a438b5908e9246392dc105))

### [6.1.2](https://github.com/nuxt-modules/tailwindcss/compare/v6.1.1...v6.1.2) (2022-10-28)


### Bug Fixes

* normalise undefined `nuxt.options.watch` ([#553](https://github.com/nuxt-modules/tailwindcss/issues/553)) ([5b373c6](https://github.com/nuxt-modules/tailwindcss/commit/5b373c6c1091808360db4a657210e21adf205d73))

### [6.1.1](https://github.com/nuxt-modules/tailwindcss/compare/v6.1.0...v6.1.1) (2022-10-24)


### Bug Fixes

* `cjs` config generation ([#551](https://github.com/nuxt-modules/tailwindcss/issues/551)) ([bd64377](https://github.com/nuxt-modules/tailwindcss/commit/bd643774be36e3e6b2e9a7b54e9141a706f6a3c6))

## [6.1.0](https://github.com/nuxt-modules/tailwindcss/compare/v6.0.1...v6.1.0) (2022-10-21)


### Features

* add option to set `cssPath` to `false` ([#544](https://github.com/nuxt-modules/tailwindcss/issues/544)) ([f45fc97](https://github.com/nuxt-modules/tailwindcss/commit/f45fc97b87eb63acdf9568d917177322d957ac82))

### [6.0.1](https://github.com/nuxt-modules/tailwindcss/compare/v6.0.0...v6.0.1) (2022-10-19)

## [6.0.0](https://github.com/nuxt-modules/tailwindcss/compare/v5.3.5...v6.0.0) (2022-10-19)


### ⚠ BREAKING CHANGES

* update viewer dev middleware to be compatible with `h3@0.8` (#545)
* You can no longer use CJS syntax (`module.exports`) in your `tailwind.config.js` (#549)

### Features

* expose config as commonjs file ([#535](https://github.com/nuxt-modules/tailwindcss/issues/535)) ([af87449](https://github.com/nuxt-modules/tailwindcss/commit/af8744972ba2409fd6a468829addb963824168e5))
* update viewer dev middleware to be compatible with `h3@0.8` ([#545](https://github.com/nuxt-modules/tailwindcss/issues/545)) ([0b1844e](https://github.com/nuxt-modules/tailwindcss/commit/0b1844efec4ed594d852938f6091178a5401f7d9))

### [5.3.5](https://github.com/nuxt-modules/tailwindcss/compare/v5.3.4...v5.3.5) (2022-10-07)


### Bug Fixes

* prevent unwanted reloads on content change ([#539](https://github.com/nuxt-modules/tailwindcss/issues/539)) ([6290ea5](https://github.com/nuxt-modules/tailwindcss/commit/6290ea58123df76eae75e7304b7c0c95300a43b7))

### [5.3.4](https://github.com/nuxt-modules/tailwindcss/compare/v5.3.3...v5.3.4) (2022-10-07)


### Bug Fixes

* remove content from tailwindConfig.content in development ([51cfad7](https://github.com/nuxt-modules/tailwindcss/commit/51cfad7aa611f543c4b5ce0b5b9f24c08348e7d3))

### [5.3.3](https://github.com/nuxt-modules/tailwindcss/compare/v5.3.2...v5.3.3) (2022-09-08)


### Bug Fixes

* resolve config paths fully and warn on config errors ([#522](https://github.com/nuxt-modules/tailwindcss/issues/522)) ([6a6dc4f](https://github.com/nuxt-modules/tailwindcss/commit/6a6dc4fc4dffefeb2141722cd8058d50ff27038e))

### [5.3.2](https://github.com/nuxt-modules/tailwindcss/compare/v5.3.1...v5.3.2) (2022-08-12)


### Bug Fixes

* **module:** remove prefix for tailwind viewer route on nuxt 2 ([#517](https://github.com/nuxt-modules/tailwindcss/issues/517)) ([2932bad](https://github.com/nuxt-modules/tailwindcss/commit/2932bad5edf9d2e8adadeaa8363923fcaa8779ec))
* remove now-unneeded `@types/tailwindcss` ([#514](https://github.com/nuxt-modules/tailwindcss/issues/514)) ([82ea9b7](https://github.com/nuxt-modules/tailwindcss/commit/82ea9b7d8dc7526641f359ded5d037f9492d7a7f))

### [5.3.1](https://github.com/nuxt-modules/tailwindcss/compare/v5.3.0...v5.3.1) (2022-07-25)


### Bug Fixes

* **module:** Nuxt 2 support ([#508](https://github.com/nuxt-modules/tailwindcss/issues/508)) ([366ddc3](https://github.com/nuxt-modules/tailwindcss/commit/366ddc3e2688a3cc86ba7b8c28b8c632104ed35f))

## [5.3.0](https://github.com/nuxt-modules/tailwindcss/compare/v5.2.0...v5.3.0) (2022-07-13)


### Features

* extends support ([#499](https://github.com/nuxt-modules/tailwindcss/issues/499)) ([f90b80b](https://github.com/nuxt-modules/tailwindcss/commit/f90b80b0289f3ab0285826fae727c37e560db657))
* support for more semantic injection positions ([#501](https://github.com/nuxt-modules/tailwindcss/issues/501)) ([1bdd83c](https://github.com/nuxt-modules/tailwindcss/commit/1bdd83cc2bdb39cb80ad476a22b791f3bdeb9cb9))

## [5.2.0](https://github.com/nuxt-modules/tailwindcss/compare/v5.1.3...v5.2.0) (2022-07-11)


### Features

* add tailwind.config.ts support ([#483](https://github.com/nuxt-modules/tailwindcss/issues/483)) ([26aebc2](https://github.com/nuxt-modules/tailwindcss/commit/26aebc2a4cb3be7fa1cc31d842becedec65827e8))


### Bug Fixes

* monkey-patch Vite HMR issue & make it reproducible ([#464](https://github.com/nuxt-modules/tailwindcss/issues/464)) ([#496](https://github.com/nuxt-modules/tailwindcss/issues/496)) ([8cc1cfa](https://github.com/nuxt-modules/tailwindcss/commit/8cc1cfa5684581d7c85f94ea2d6f60c5e4abf52a))

### [5.1.3](https://github.com/nuxt-modules/tailwindcss/compare/v5.1.2...v5.1.3) (2022-06-22)


### Bug Fixes

* add prefix for tailwind viewer route ([#460](https://github.com/nuxt-modules/tailwindcss/issues/460)) ([9df49b5](https://github.com/nuxt-modules/tailwindcss/commit/9df49b5f2559c3034424ed7e19b621d814682b71))

### [5.1.2](https://github.com/nuxt-modules/tailwindcss/compare/v5.1.1...v5.1.2) (2022-05-23)


### Bug Fixes

* use correct defuArrayFn and fix srcDir error ([cef3a9f](https://github.com/nuxt-modules/tailwindcss/commit/cef3a9f68310deb512f2c6592516a986801d439d))

### [5.1.1](https://github.com/nuxt-modules/tailwindcss/compare/v5.1.0...v5.1.1) (2022-05-23)


### Bug Fixes

* **content:** Add support for error file ([#467](https://github.com/nuxt-modules/tailwindcss/issues/467)) ([be06c68](https://github.com/nuxt-modules/tailwindcss/commit/be06c687f2605ffc57b202878ac5a1a68147a4cd))

## [5.1.0](https://github.com/nuxt-modules/tailwindcss/compare/v5.0.4...v5.1.0) (2022-05-23)


### Features

* resolve `cssPath` with `resolvePath` ([#465](https://github.com/nuxt-modules/tailwindcss/issues/465)) ([656eea5](https://github.com/nuxt-modules/tailwindcss/commit/656eea5ed53206b102951bfcef8fc161f55f6cad))

### [5.0.4](https://github.com/nuxt-modules/tailwindcss/compare/v5.0.3...v5.0.4) (2022-05-02)


### Bug Fixes

* add tailwindcss types ([#462](https://github.com/nuxt-modules/tailwindcss/issues/462)) ([379c816](https://github.com/nuxt-modules/tailwindcss/commit/379c816159af56a4e9c8a9760d3545dbb269d864))

### [5.0.3](https://github.com/nuxt-modules/tailwindcss/compare/v5.0.2...v5.0.3) (2022-04-20)


### Bug Fixes

* tailwind viewer url ([#453](https://github.com/nuxt-modules/tailwindcss/issues/453)) ([d35b39c](https://github.com/nuxt-modules/tailwindcss/commit/d35b39c6b20a89f1005c383dff003137af0d5b66))

### [5.0.2](https://github.com/nuxt-modules/tailwindcss/compare/v5.0.1...v5.0.2) (2022-03-16)


### Bug Fixes

* init postcss plugins (nuxt 2) and use default nesting config ([8afaf22](https://github.com/nuxt-modules/tailwindcss/commit/8afaf22ab8ef9f4ea418630fd9b29fe04de59fea))

### [5.0.1](https://github.com/nuxt-modules/tailwindcss/compare/v5.0.0...v5.0.1) (2022-03-15)


### Bug Fixes

* append to postcss options and use new nuxt 3 schema ([#437](https://github.com/nuxt-modules/tailwindcss/issues/437)) ([fed1c31](https://github.com/nuxt-modules/tailwindcss/commit/fed1c311a0b6ea4f7d37d5367ceedd2d36e84ab9))
* enable `postcss-nesting` by default ([bac29b4](https://github.com/nuxt-modules/tailwindcss/commit/bac29b4c59acd06dc7a4ba6a7440105131de49c7))

## [5.0.0](https://github.com/nuxt-modules/tailwindcss/compare/v5.0.0-4...v5.0.0) (2022-03-08)


### Bug Fixes

* add composables directory to content ([c36333a](https://github.com/nuxt-modules/tailwindcss/commit/c36333a827af6c385a23647fb9bd381b69b8c77a))

## [5.0.0-4](https://github.com/nuxt-modules/tailwindcss/compare/v5.0.0-3...v5.0.0-4) (2022-02-10)


### Bug Fixes

* import `tailwindcss/resolveConfig` with extension ([#426](https://github.com/nuxt-modules/tailwindcss/issues/426)) ([d0aca40](https://github.com/nuxt-modules/tailwindcss/commit/d0aca40e45c0854eae6affdd3a736ec44553c04e))

## [5.0.0-3](https://github.com/nuxt-modules/tailwindcss/compare/v5.0.0-2...v5.0.0-3) (2022-02-08)


### Bug Fixes

* properly resolve `tailwind.config` (resolves [#425](https://github.com/nuxt-modules/tailwindcss/issues/425)) ([7a7a5f6](https://github.com/nuxt-modules/tailwindcss/commit/7a7a5f698f82d1c49360a41d6a4e9aa431aed0c1))

## [5.0.0-2](https://github.com/nuxt-modules/tailwindcss/compare/v5.0.0-1...v5.0.0-2) (2022-02-08)


### Bug Fixes

* de-default tailwind-config-viewer import ([75ea329](https://github.com/nuxt-modules/tailwindcss/commit/75ea329a6bd56137f2060255c453c136f3d5c069))

## [5.0.0-1](https://github.com/nuxt-modules/tailwindcss/compare/v5.0.0-0...v5.0.0-1) (2022-02-08)

## [5.0.0-0](https://github.com/nuxt-modules/tailwindcss/compare/v4.2.1...v5.0.0-0) (2022-02-08)


### ⚠ BREAKING CHANGES

* rewrite with module-builder and nuxt/kit (#419)

### Features

* add css inject position ([#381](https://github.com/nuxt-modules/tailwindcss/issues/381)) ([4510784](https://github.com/nuxt-modules/tailwindcss/commit/45107842bb08556b7383dd6b51cf74b6d2dd4a24))
* migrate to tailwind v3 ([#407](https://github.com/nuxt-modules/tailwindcss/issues/407)) ([eacaa5e](https://github.com/nuxt-modules/tailwindcss/commit/eacaa5e167887f729611f9cc6330e44df99c71c5))


* rewrite with module-builder and nuxt/kit ([#419](https://github.com/nuxt-modules/tailwindcss/issues/419)) ([8ce8255](https://github.com/nuxt-modules/tailwindcss/commit/8ce8255daa83f34361292e896dda6addca694587))

## [4.2.0](https://github.com/nuxt-modules/tailwindcss/compare/v4.1.3...v4.2.0) (2021-06-22)


### Features

* set cssPath false to disable adding the CSS ([#362](https://github.com/nuxt-modules/tailwindcss/issues/362)) ([695d068](https://github.com/nuxt-modules/tailwindcss/commit/695d0681c2cabe64bcfd97968a0c9ddcb8ada98c))

### [4.1.3](https://github.com/nuxt-modules/tailwindcss/compare/v4.1.2...v4.1.3) (2021-06-05)


### Bug Fixes

* add ts extension for purging components folder ([#356](https://github.com/nuxt-modules/tailwindcss/issues/356)) ([8328c52](https://github.com/nuxt-modules/tailwindcss/commit/8328c52b0a96c35fd117b0366e697b79ee1d741a))

### [4.1.2](https://github.com/nuxt-modules/tailwindcss/compare/v4.1.1...v4.1.2) (2021-05-13)

### [4.1.1](https://github.com/nuxt-modules/tailwindcss/compare/v4.1.0...v4.1.1) (2021-05-07)

## [4.1.0](https://github.com/nuxt-modules/tailwindcss/compare/v4.0.3...v4.1.0) (2021-05-05)


### Features

* Update tailwind to 2.1 to natively support JIT ([#326](https://github.com/nuxt-modules/tailwindcss/issues/326)) ([dfa989a](https://github.com/nuxt-modules/tailwindcss/commit/dfa989a78ea444ebcc5357043848d4e034fe4b89))

### [4.0.3](https://github.com/nuxt-modules/tailwindcss/compare/v4.0.2...v4.0.3) (2021-04-01)

### [4.0.2](https://github.com/nuxt-modules/tailwindcss/compare/v4.0.1...v4.0.2) (2021-03-23)

### [4.0.1](https://github.com/nuxt-modules/tailwindcss/compare/v4.0.0...v4.0.1) (2021-03-16)


### Bug Fixes

* use postcss-nesting instead ([6240fdf](https://github.com/nuxt-modules/tailwindcss/commit/6240fdf331557f4b87a2580c545f3b49ce3faab5))

## [4.0.0](https://github.com/nuxt-modules/tailwindcss/compare/v3.4.3...v4.0.0) (2021-03-15)


### ⚠ BREAKING CHANGES

* v4 (#287)

### Features

* v4 ([#287](https://github.com/nuxt-modules/tailwindcss/issues/287)) ([15a86a9](https://github.com/nuxt-modules/tailwindcss/commit/15a86a9628f9fb941ebe8a6eba62f3b6ab579b04)), closes [#270](https://github.com/nuxt-modules/tailwindcss/issues/270) [#276](https://github.com/nuxt-modules/tailwindcss/issues/276) [#288](https://github.com/nuxt-modules/tailwindcss/issues/288)

## [4.0.0-12](https://github.com/nuxt-modules/tailwindcss/compare/v4.0.0-11...v4.0.0-12) (2021-03-15)

## [4.0.0-11](https://github.com/nuxt-modules/tailwindcss/compare/v4.0.0-10...v4.0.0-11) (2021-03-15)

## [4.0.0-10](https://github.com/nuxt-modules/tailwindcss/compare/v4.0.0-9...v4.0.0-10) (2021-03-13)


### Bug Fixes

* revert to using object syntax ([a8d4acf](https://github.com/nuxt-modules/tailwindcss/commit/a8d4acfd3ee60b14858f04a6af5d938276b1aa05))

## [4.0.0-9](https://github.com/nuxt-modules/tailwindcss/compare/v4.0.0-8...v4.0.0-9) (2021-03-13)


### Bug Fixes

* dont expose config without option defined ([d98086e](https://github.com/nuxt-modules/tailwindcss/commit/d98086e7db5e110891c0c2dd97dbc79d352cef9b))

## [4.0.0-8](https://github.com/nuxt-modules/tailwindcss/compare/v4.0.0-7...v4.0.0-8) (2021-03-12)

## [4.0.0-7](https://github.com/nuxt-modules/tailwindcss/compare/v4.0.0-5...v4.0.0-7) (2021-03-12)


### Features

* tailwind jit ([#288](https://github.com/nuxt-modules/tailwindcss/issues/288)) ([24dc6c0](https://github.com/nuxt-modules/tailwindcss/commit/24dc6c028f9399a58d2e1d73021a9f6532466775))

## [4.0.0-6](https://github.com/nuxt-modules/tailwindcss/compare/v4.0.0-5...v4.0.0-6) (2021-03-12)


### Features

* tailwind jit ([#288](https://github.com/nuxt-modules/tailwindcss/issues/288)) ([24dc6c0](https://github.com/nuxt-modules/tailwindcss/commit/24dc6c028f9399a58d2e1d73021a9f6532466775))

## [4.0.0-5](https://github.com/nuxt-modules/tailwindcss/compare/v3.4.3...v4.0.0-5) (2021-03-10)

## [4.0.0-4](https://github.com/nuxt-modules/tailwindcss/compare/v4.0.0-3...v4.0.0-4) (2021-03-09)

## [4.0.0-3](https://github.com/nuxt-modules/tailwindcss/compare/v4.0.0-2...v4.0.0-3) (2021-03-08)

## [4.0.0-2](https://github.com/nuxt-modules/tailwindcss/compare/v4.0.0-1...v4.0.0-2) (2021-03-08)


### Bug Fixes

* use purge as object and force it to provide purge options ([910843f](https://github.com/nuxt-modules/tailwindcss/commit/910843f10f6da538a261dfd7726ee82aeb6db6f1))

## [4.0.0-1](https://github.com/nuxt-modules/tailwindcss/compare/v4.0.0-0...v4.0.0-1) (2021-03-08)

## [4.0.0-0](https://github.com/nuxt-modules/tailwindcss/compare/v3.4.2...v4.0.0-0) (2021-03-05)


### ⚠ BREAKING CHANGES

* upgrade to tailwindcss@2 (#270)

### Features

* upgrade to tailwindcss@2 ([#270](https://github.com/nuxt-modules/tailwindcss/issues/270)) ([8ab33b8](https://github.com/nuxt-modules/tailwindcss/commit/8ab33b802005b80cd372e9a268e1c20ac8db8007))

### [3.4.3](https://github.com/nuxt-modules/tailwindcss/compare/v3.4.2...v3.4.3) (2021-03-10)


### Bug Fixes

* use nuxt resolver to import `tailwind.config.js` ([#286](https://github.com/nuxt-modules/tailwindcss/issues/286)) ([62526cf](https://github.com/nuxt-modules/tailwindcss/commit/62526cf1af8319275dbf39f8d330063e661b1b50))

### [3.4.2](https://github.com/nuxt-modules/tailwindcss/compare/v3.4.1...v3.4.2) (2020-12-22)

### [3.4.1](https://github.com/nuxt-modules/tailwindcss/compare/v3.4.0...v3.4.1) (2020-12-18)


### Bug Fixes

* **middleware:** use cjs syntax ([#236](https://github.com/nuxt-modules/tailwindcss/issues/236)) ([f35b1cc](https://github.com/nuxt-modules/tailwindcss/commit/f35b1cc44dc9b3d1ff926b7d377d64c354b3697d))

## [3.4.0](https://github.com/nuxt-modules/tailwindcss/compare/v3.3.4...v3.4.0) (2020-12-17)


### Features

* integrate tailwind-config-viewer ([#232](https://github.com/nuxt-modules/tailwindcss/issues/232)) ([cc9fb3f](https://github.com/nuxt-modules/tailwindcss/commit/cc9fb3f9b793fb7a3a931059ab20388130e137df))

### [3.3.4](https://github.com/nuxt-modules/tailwindcss/compare/v3.3.3...v3.3.4) (2020-12-11)


### Bug Fixes

* addTemplate call compats low version nuxt ([#225](https://github.com/nuxt-modules/tailwindcss/issues/225)) ([b18380d](https://github.com/nuxt-modules/tailwindcss/commit/b18380dcd529d679314563f54f66dfe84556767c))

### [3.3.3](https://github.com/nuxt-modules/tailwindcss/compare/v3.3.2...v3.3.3) (2020-12-04)

### [3.3.2](https://github.com/nuxt-modules/tailwindcss/compare/v3.3.1...v3.3.2) (2020-12-04)


### Bug Fixes

* **lib:** check listeners value before ([431eafc](https://github.com/nuxt-modules/tailwindcss/commit/431eafcce286317b0efdc1f4f7de303daaf672c9)), closes [#216](https://github.com/nuxt-modules/tailwindcss/issues/216)

### [3.3.1](https://github.com/nuxt-modules/tailwindcss/compare/v3.3.0...v3.3.1) (2020-12-03)


### Bug Fixes

* handle color as string and smarted light/dark detection ([6058ea8](https://github.com/nuxt-modules/tailwindcss/commit/6058ea81021b2aee33ed3bb8a262352a3b35414a))

## [3.3.0](https://github.com/nuxt-modules/tailwindcss/compare/v3.2.0...v3.3.0) (2020-12-02)


### Features

* add tailwind colors page ([#215](https://github.com/nuxt-modules/tailwindcss/issues/215)) ([43db226](https://github.com/nuxt-modules/tailwindcss/commit/43db226c51bd354ea54bd4638c9da882a1fb9442))

## [3.2.0](https://github.com/nuxt-modules/tailwindcss/compare/v3.1.0...v3.2.0) (2020-10-22)


### Features

* use [@tailwind](https://github.com/tailwind) util ([#182](https://github.com/nuxt-modules/tailwindcss/issues/182)) ([839b77c](https://github.com/nuxt-modules/tailwindcss/commit/839b77c50b7a81c0214d953f19b8db3ba1e3fbc4))

## [3.1.0](https://github.com/nuxt-modules/tailwindcss/compare/v3.0.2...v3.1.0) (2020-09-25)


### Features

* **purge:** handle custom srcDir and support TS ([#170](https://github.com/nuxt-modules/tailwindcss/issues/170)) ([bf3e0db](https://github.com/nuxt-modules/tailwindcss/commit/bf3e0db0b9188ad72a66ea98191583f19f979454))

### [3.0.2](https://github.com/nuxt-modules/tailwindcss/compare/v3.0.1...v3.0.2) (2020-08-25)


### Bug Fixes

* handle HMR for tailwind config ([8c26472](https://github.com/nuxt-modules/tailwindcss/commit/8c26472031d10400d829200fd6d65f0306ab442d)), closes [#157](https://github.com/nuxt-modules/tailwindcss/issues/157)

### [3.0.1](https://github.com/nuxt-modules/tailwindcss/compare/v3.0.0...v3.0.1) (2020-08-24)

## [3.0.0](https://github.com/nuxt-modules/tailwindcss/compare/v2.1.1...v3.0.0) (2020-08-05)


### ⚠ BREAKING CHANGES

* ability to extend the Tailwind config (#133)

### Features

* ability to extend the Tailwind config ([#133](https://github.com/nuxt-modules/tailwindcss/issues/133)) ([9d297b2](https://github.com/nuxt-modules/tailwindcss/commit/9d297b22fc20b41fafe897ccfb21cd98ac66c1ce)), closes [#131](https://github.com/nuxt-modules/tailwindcss/issues/131)

### [2.1.1](https://github.com/nuxt-modules/tailwindcss/compare/v2.1.0...v2.1.1) (2020-07-29)

## [2.1.0](https://github.com/nuxt-modules/tailwindcss/compare/v1.4.1...v2.1.0) (2020-07-20)


### Features

* use tailwind v1.4 and use purge option ([#95](https://github.com/nuxt-modules/tailwindcss/issues/95)) ([09c0ee5](https://github.com/nuxt-modules/tailwindcss/commit/09c0ee570c9e21c53864a1466f49552dc48a35c7))


### Bug Fixes

* force production env for postcss on nuxt build ([977d605](https://github.com/nuxt-modules/tailwindcss/commit/977d605858891396c7a689cf545b85e4fc718b52))

### [1.4.1](https://github.com/nuxt-modules/tailwindcss/compare/v1.4.0...v1.4.1) (2020-04-22)


### Bug Fixes

* eslint ([8963f19](https://github.com/nuxt-modules/tailwindcss/commit/8963f19f3704e852cfa3eff884699484c0a8ca7e))
* keep only linux ([f43a6c9](https://github.com/nuxt-modules/tailwindcss/commit/f43a6c9ea1bbc9324cf930d2789ead8afb537ab4))

## [1.2.0](https://github.com/nuxt-modules/tailwindcss/compare/v1.1.2...v1.2.0) (2019-11-05)


### Features

* add support for deprecated build.postcss.plugins array syntax ([#36](https://github.com/nuxt-modules/tailwindcss/issues/36)) ([6c3f550](https://github.com/nuxt-modules/tailwindcss/commit/6c3f550))

### [1.1.2](https://github.com/nuxt-modules/tailwindcss/compare/v1.1.1...v1.1.2) (2019-08-08)


### Bug Fixes

* upgrade tailwind and remove log ([c2a5798](https://github.com/nuxt-modules/tailwindcss/commit/c2a5798))

### [1.1.1](https://github.com/nuxt-modules/tailwindcss/compare/v1.1.0...v1.1.1) (2019-07-29)


### Bug Fixes

* changelog ([bc65736](https://github.com/nuxt-modules/tailwindcss/commit/bc65736))



## [1.1.0](https://github.com/nuxt-modules/tailwindcss/compare/v0.1.0...v1.1.0) (2019-06-12)


### Features

* refactor: module and increase coverage ([#5](https://github.com/nuxt-modules/tailwindcss/issues/5)) ([43443c2](https://github.com/nuxt-modules/tailwindcss/commit/43443c24524290602f9215fcb793e4ace7c75b5b))


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
