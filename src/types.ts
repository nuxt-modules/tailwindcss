type Import = Exclude<Parameters<typeof import('nuxt/kit')['addImports']>[0], any[]>

export type TWConfig = import('tailwindcss').Config
export type InjectPosition = 'first' | 'last' | number | { after: string }

type _Omit<T, K extends PropertyKey> = { [P in keyof T as Exclude<P, K>]: T[P] }

type InlineTWConfig = _Omit<TWConfig, 'content' | 'plugins' | 'safelist'> & {
  content?: (Extract<TWConfig['content'], any[]> | _Omit<Extract<TWConfig['content'], Record<string, any>>, 'extract' | 'transform'>)
  // plugins?: Extract<NonNullable<TWConfig['plugins']>[number], string | [string, any]>[] // incoming in Oxide
  safelist?: Exclude<NonNullable<TWConfig['safelist']>[number], Record<string, any>>[]
}

type BoolObj<T extends Record<string, any>> = boolean | Partial<T>
type Arrayable<T> = T | T[]

export type ViewerConfig = {
  /**
   * The endpoint for the viewer
   *
   * @default '/_tailwind'
   */
  endpoint: `/${string}`
  /**
   * Export the viewer during build
   *
   * Works in Nuxt 3; for Nuxt 2, use `npx tailwind-config-viewer export`
   *
   * @default false
   */
  exportViewer: boolean
}

export type ExposeConfig = {
  /**
   * Import name for the configuration
   *
   * @default '#tailwind-config'
   * @deprecated use `alias` in `nuxt.config` instead - https://nuxt.com/docs/api/nuxt-config#alias
   */
  alias: string
  /**
   * Deeper references within configuration for optimal tree-shaking.
   *
   * @default 2
   */
  level: number
  /**
   * To write the templates to file-system for usage with code that does not have access to the Virtual File System. This applies only for Nuxt 3 with Vite.
   *
   * @deprecated use a module if a necessary using the `app:templates` hook to write templates like so: https://github.com/nuxt/module-builder/blob/4697f18429efb83b82f3b256dd8926bb94d3df77/src/commands/prepare.ts#L37-L43
   */
  write?: boolean
}

export type EditorSupportConfig = {
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
  autocompleteUtil: BoolObj<Pick<Import, 'as'>>
}

export type ExperimentalOptions = {
  /**
   * Specify individual files for Nuxt scanned directories in content configuration
   * using `pages:extend` and `components:extend` hook.
   *
   * @default false
   */
  strictScanContentPaths: boolean
}

export interface ModuleOptions {
  /**
   * The path of the Tailwind configuration file. The extension can be omitted, in which case it will try to find a `.js`, `.cjs`, `.mjs`, or `.ts` file.
   *
   * @default []
   * @deprecated provide string in `config`
   */
  configPath: Arrayable<string>
  /**
   * The path of the Tailwind CSS file. If the file does not exist, the module's default CSS file will be imported instead.
   *
   * @default '~/assets/css/tailwind.css'
   */
  cssPath: string | false | [string, { injectPosition: InjectPosition }]
  /**
   * Configuration for Tailwind CSS. Accepts (array of) string and inline configurations.
   *
   * for default, see https://tailwindcss.nuxtjs.org/tailwind/config
   */
  config: Arrayable<InlineTWConfig | string>
  /**
   * [tailwind-config-viewer](https://github.com/rogden/tailwind-config-viewer) usage *in development*
   *
   * @default true // { endpoint: '_tailwind' }
   */
  viewer: BoolObj<ViewerConfig>
  /**
   * Usage of configuration references in runtime. See https://tailwindcss.nuxtjs.org/tailwind/config#referencing-in-the-application
   *
   * @default false // if true, { alias: '#tailwind-config', level: 2 }
   */
  exposeConfig: BoolObj<ExposeConfig>
  /**
   * Suppress logging to the console when everything is ok
   *
   * @default nuxt.options.logLevel === 'silent'
   */
  quiet: boolean
  /**
   * Enable some utilities for better editor support and DX.
   *
   * Read https://tailwindcss.nuxtjs.org/tailwind/editor-support.
   *
   * @default false // if true, { autocompleteUtil: true }
   */
  editorSupport: BoolObj<EditorSupportConfig>
  /**
   * Enable module experimental functionalities.
   *
   * @default false
   */
  experimental?: Partial<ExperimentalOptions>
  /**
   * This option falls back to the Tailwind configuration inlined to the PostCSS
   * loader, so any configuration changes while the dev server is running will
   * not reflect. This is similar to the functionality prior to v6.12.0.
   *
   * Note: this is only provided for temporary broken builds that may require
   * migration. Usage is discouraged. If any issues occur without this, please open
   * an issue on https://github.com/nuxt-modules/tailwindcss/issues.
   */
  disableHMR?: boolean
}

// Hooks TODO: either deprecate or make hooks read-only. Modifications from hooks should rather be done by addition of new configs with defuFn strategy.

export interface ModuleHooks {
  /**
   * Passes any Tailwind configuration read by the module for each (extended) [layer](https://nuxt.com/docs/getting-started/layers) and [path](https://tailwindcss.nuxtjs.org/getting-started/options#configpath) before merging all of them.
   *
   * @param tailwindConfig
   * @returns
   */
  'tailwindcss:config': (tailwindConfig: Partial<TWConfig>) => void
  /**
   * Passes the resolved vanilla configuration read from all layers and paths with merging using [defu](https://github.com/unjs/defu).
   *
   * @param tailwindConfig
   * @param configPath
   * @param index
   * @param configPaths
   * @returns
   */
  'tailwindcss:loadConfig': (tailwindConfig: Partial<TWConfig> | undefined, configPath: string, index: number, configPaths: string[]) => void
  /**
   * Passes the complete resolved configuration with all defaults from [the full Tailwind config](https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/config.full.js) using resolveConfig.
   *
   * @param tailwindConfig
   * @returns
   */
  'tailwindcss:resolvedConfig': (tailwindConfig: ReturnType<typeof import('tailwindcss/resolveConfig')>, oldTailwindConfig: TWConfig | undefined) => void
}
