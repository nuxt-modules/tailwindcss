import { existsSync } from 'fs'
import { defu } from 'defu'
import { join, relative, resolve } from 'pathe'
import { addTemplate, createResolver, findPath, useNuxt, tryResolveModule, resolveAlias } from '@nuxt/kit'
import type { Arrayable, EditorSupportConfig, ExposeConfig, InjectPosition, ModuleOptions, ViewerConfig } from './types'

/**
 * Resolves all configPath values for an application
 *
 * @param path configPath for a layer
 * @returns array of resolved paths
 */
export const resolveConfigPath = async (path: Arrayable<string>) => (
  await Promise.all(
    (Array.isArray(path) ? path : [path])
      .filter(Boolean)
      .map((path) => findPath(path, { extensions: ['.js', '.cjs', '.mjs', '.ts'] }))
  )
).filter((i): i is string => Boolean(i))

/**
 *
 * @param srcDir
 * @returns array of resolved content globs
 */
export const resolveContentPaths = (srcDir: string, nuxt = useNuxt()) => {
  const r = (p: string) => p.startsWith(srcDir) ? p : resolve(srcDir, p)
  const extensionFormat = (s: string[]) => s.length > 1 ? `.{${s.join(',')}}` : `.${s.join('') || 'vue'}`

  const defaultExtensions = extensionFormat(['js', 'ts', 'mjs'])
  const extensions = Array.from(new Set(['vue', ...nuxt.options.extensions]))
  const sfcExtensions = extensionFormat(extensions.map(e => e.replace(/^\.*/, '')))

  const importDirs = [...(nuxt.options.imports?.dirs || [])].map(r)
  const [composablesDir, utilsDir] = [resolve(srcDir, 'composables'), resolve(srcDir, 'utils')]

  if (!importDirs.includes(composablesDir)) importDirs.push(composablesDir)
  if (!importDirs.includes(utilsDir)) importDirs.push(utilsDir)

  return [
    r(`components/**/*${sfcExtensions}`),
    ...(() => {
      if (nuxt.options.components) {
        return (Array.isArray(nuxt.options.components) ? nuxt.options.components : typeof nuxt.options.components === 'boolean' ? ['components'] : nuxt.options.components.dirs).map(d => `${resolveAlias(typeof d === 'string' ? d : d.path)}/**/*${sfcExtensions}`)
      }
      return []
    })(),

    nuxt.options.dir.layouts && r(`${nuxt.options.dir.layouts}/**/*${sfcExtensions}`),
    ...([true, undefined].includes(nuxt.options.pages) ? [r(`${nuxt.options.dir.pages}/**/*${sfcExtensions}`)] : []),

    nuxt.options.dir.plugins && r(`${nuxt.options.dir.plugins}/**/*${defaultExtensions}`),
    ...importDirs.map(d => `${d}/**/*${defaultExtensions}`),

    r(`{A,a}pp${sfcExtensions}`),
    r(`{E,e}rror${sfcExtensions}`),
    r(`app.config${defaultExtensions}`),
  ].filter(Boolean)
}

/**
 *
 * @param configPath
 * @param nuxt
 * @returns [configuration paths, default resolved content paths]
 */
export const resolveModulePaths = async (configPath: ModuleOptions['configPath'], nuxt = useNuxt()): Promise<[string[], string[]]> => (
  (nuxt.options._layers && nuxt.options._layers.length > 1)
  // Support `extends` directories
  ? (await Promise.all(
      // nuxt.options._layers is from rootDir to nested level
      // We need to reverse the order to give the deepest tailwind.config the lowest priority
      nuxt.options._layers.slice().reverse().map(async (layer) => ([
        await resolveConfigPath(layer?.config?.tailwindcss?.configPath || join(layer.cwd, 'tailwind.config')),
        resolveContentPaths(layer?.config?.srcDir || layer.cwd)
      ])))
    ).reduce((prev, curr) => prev.map((p, i) => p.concat(curr[i]))) as any
  : [await resolveConfigPath(configPath), resolveContentPaths(nuxt.options.srcDir)]
)

/**
 *
 * @param cssPath
 * @param nuxt
 * @returns [resolvedCss, loggerMessage]
 */
export async function resolveCSSPath (cssPath: Exclude<ModuleOptions['cssPath'], Array<any>>, nuxt = useNuxt()): Promise<[string, string]> {
  if (typeof cssPath === 'string') {
    return existsSync(cssPath)
      ? [cssPath, `Using Tailwind CSS from ~/${relative(nuxt.options.srcDir, cssPath)}`]
      : await tryResolveModule('tailwindcss/package.json')
        .then(twLocation => twLocation ? [join(twLocation, '../tailwind.css'), 'Using default Tailwind CSS file'] : Promise.reject('tailwindcss not resolved'))
        .catch(e => [
          createResolver(import.meta.url).resolve(
            addTemplate({
              filename: '_tailwind.css',
              write: true,
              getContents: () => '@tailwind base;\n@tailwind components;\n@tailwind utilities;'
            }).dst
          ),
          `Faced error while trying to use default Tailwind CSS file: ${e?.name || ''} ${e?.message || e}\nCreated default Tailwind CSS file`
        ]) as [string, string]
  } else {
    return [
      createResolver(import.meta.url).resolve(
        addTemplate({
          filename: 'tailwind-empty.css',
          write: true,
          getContents: () => ''
        }).dst
      ),
      'No Tailwind CSS file found. Skipping...'
    ]
  }
}

/**
 * Resolves a boolean | object as an object with defaults
 * @param config
 * @param fb
 *
 * @returns object
 */
const resolveBoolObj = <T, U extends Record<string, any>>(config: T, fb: U): U => defu(typeof config === 'object' ? config : {}, fb)
export const resolveViewerConfig = (config: ModuleOptions['viewer']): ViewerConfig => resolveBoolObj(config, { endpoint: '/_tailwind', exportViewer: false })
export const resolveExposeConfig = (config: ModuleOptions['exposeConfig']): ExposeConfig => resolveBoolObj(config, { alias: '#tailwind-config', level: 2 })
export const resolveEditorSupportConfig = (config: ModuleOptions['editorSupport']): EditorSupportConfig => resolveBoolObj(config, { autocompleteUtil: true, generateConfig: false })

/**
 * Resolve human-readable inject position specification into absolute index in the array
 *
 * @param css nuxt css config
 * @param position position to inject
 *
 * @returns index in the css array
 */
export function resolveInjectPosition (css: string[], position: InjectPosition = 'first') {
  if (typeof (position) === 'number') {
    return ~~Math.min(position, css.length + 1)
  }

  if (typeof (position) === 'string') {
    switch (position) {
      case 'first': return 0
      case 'last': return css.length
      default: throw new Error('invalid literal: ' + position)
    }
  }

  if (position.after !== undefined) {
    const index = css.indexOf(position.after)
    if (index === -1) {
      throw new Error('`after` position specifies a file which does not exists on CSS stack: ' + position.after)
    }

    return index + 1
  }

  throw new Error('invalid position: ' + JSON.stringify(position))
}
