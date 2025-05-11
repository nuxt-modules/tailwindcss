import { existsSync, promises as fsp } from 'node:fs'
import {
  defineNuxtModule,
  addVitePlugin,
  resolvePath,
  useNuxt,
  createResolver,
  addImports,
} from '@nuxt/kit'
import { join } from 'pathe'
import { name, version, configKey, compatibility } from '../package.json'
import installPlugin from './install-plugin'
import importCSS from './import-css'

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey,
    compatibility,
  },
  defaults: (nuxt = useNuxt()) => ({
    cssFile: join(nuxt.options.dir.assets, 'css/tailwind.css'),
  }),
  async setup(moduleOptions, nuxt) {
    const resolver = createResolver(import.meta.url)

    await installPlugin(nuxt)

    addImports({ name: 'autocompleteUtil', from: resolver.resolve('./runtime/utils'), as: 'tw' })

    nuxt.hook('modules:done', async () => {
      await importCSS(nuxt)
    })
  },
})
