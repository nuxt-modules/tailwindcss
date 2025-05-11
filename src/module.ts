import { existsSync } from 'node:fs'
import {
  defineNuxtModule,
  addVitePlugin,
  addTemplate,
  resolvePath,
  useNuxt,
  createResolver,
  addImports,
} from '@nuxt/kit'
import { join } from 'pathe'
import { name, version, configKey, compatibility } from '../package.json'

async function resolveCSSPath(cssPath: string) {
  const _cssPath = await resolvePath(cssPath, { extensions: ['.css', '.sass', '.scss', '.less', '.styl'], virtual: true })

  return existsSync(_cssPath)
    ? _cssPath
    : addTemplate({ filename: 'tailwind.css', getContents: () => `@import 'tailwindcss';` }).dst
}

type RelativeInjectPosition = { after: string } | { before: string } | Record<'after' | 'before', string>
type InjectPosition = 'first' | 'last' | number | RelativeInjectPosition

async function resolveInjectPosition(css: string[], position: InjectPosition = 'first') {
  if (typeof (position) === 'number') {
    return ~~Math.min(position, css.length + 1)
  }

  if (typeof (position) === 'string') {
    switch (position) {
      case 'first': return 0
      case 'last': return css.length
    }
  }

  if (typeof (position) === 'object') {
    const minIndex = 'after' in position ? css.indexOf(await resolvePath(position.after)) + 1 : 0
    const maxIndex = 'before' in position ? css.indexOf(await resolvePath(position.before)) : css.length

    if ([minIndex, maxIndex].includes(-1)) {
      throw new Error(`\`injectPosition\` specifies a file which does not exists on CSS stack: ` + JSON.stringify(position))
    }

    if (minIndex > maxIndex) {
      throw new Error(`\`injectPosition\` specifies a relative location \`${minIndex}\` that cannot be resolved (i.e., \`after\` orders \`before\` may be reversed): ` + JSON.stringify(position))
    }

    return 'after' in position ? minIndex : maxIndex
  }

  throw new Error('invalid `injectPosition`: ' + JSON.stringify(position))
}

type EditorSupportConfig = Partial<{
  /**
   * Enable utility to write Tailwind CSS classes inside strings.
   *
   * You will need to update `.vscode/settings.json` based on this value. This works only for Nuxt 3 or Nuxt 2 with Bridge.
   *
   * ```json
   * {
   *   "tailwindCSS.experimental.classRegex": ["tw`(.*?)`", "tw\\('(.*?)'\\)"]
   * }
   * ```
   *
   * Read https://tailwindcss.nuxtjs.org/tailwind/editor-support#string-classes-autocomplete.
   *
   * @default false // if true, { as: 'tw' }
   */
  autocompleteUtil: false | true | Pick<Exclude<Parameters<typeof addImports>[0], any[]>, 'as'>
}>

export interface ModuleOptions {
  /**
   * The path of the Tailwind CSS file. If the file does not exist, the module's default CSS file will be imported instead.
   *
   * The default is `<assets>/css/tailwind.css` if found, else we generate a CSS file with `@import "tailwindcss"` in the buildDir.
   */
  cssFile: string | false | [string, { position: InjectPosition }]
  /**
   * Enable some utilities for better editor support and DX.
   *
   * Read https://tailwindcss.nuxtjs.org/tailwind/editor-support.
   *
   * @default false // if true, { autocompleteUtil: true }
   */
  editorSupport: false | true | EditorSupportConfig
}

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

    if (nuxt.options.builder === '@nuxt/vite-builder') {
      const existsTailwindPlugin = (plugins = nuxt.options.vite.plugins): boolean => !!plugins?.some((plugin) => {
        if (Array.isArray(plugin)) {
          return existsTailwindPlugin(plugin)
        }

        return plugin && 'name' in plugin && plugin.name.startsWith('@tailwindcss/vite')
      })

      if (!existsTailwindPlugin()) {
        await import('@tailwindcss/vite').then(r => addVitePlugin(r.default()))
      }
    }
    else {
      nuxt.options.postcss ??= { plugins: {}, order: [] }
      nuxt.options.postcss.plugins ??= {}

      if (!nuxt.options.postcss.plugins['@tailwindcss/postcss']) {
        nuxt.options.postcss.plugins['@tailwindcss/postcss'] = {}
      }
    }

    if (moduleOptions.editorSupport) {
      const { autocompleteUtil = true } = (typeof moduleOptions.editorSupport === 'object' ? typeof moduleOptions.editorSupport : {}) as EditorSupportConfig

      if (autocompleteUtil) {
        addImports({
          name: 'autocompleteUtil',
          from: resolver.resolve('./runtime/utils'),
          as: 'tw',
          ...(typeof autocompleteUtil === 'object' ? autocompleteUtil : {}),
        })
      }
    }

    nuxt.hook('modules:done', async () => {
      // resolve CSS
      const [cssPath, cssPathConfig] = Array.isArray(moduleOptions.cssFile) ? moduleOptions.cssFile : [moduleOptions.cssFile]
      if (!cssPath) return

      const resolvedCss = await resolveCSSPath(cssPath)
      nuxt.options.css = nuxt.options.css ?? []
      const resolvedNuxtCss = await Promise.all(nuxt.options.css.map((p: any) => resolvePath(p.src ?? p))) || []

      // inject only if this file isn't listed already by user
      if (!resolvedNuxtCss.includes(resolvedCss)) {
        const injectPosition = await resolveInjectPosition(resolvedNuxtCss, cssPathConfig?.position)
        nuxt.options.css.splice(injectPosition, 0, resolvedCss)
      }
    })
  },
})
