import { existsSync } from 'fs'
import { defu } from 'defu'
import { join, relative, resolve } from 'pathe'
import { findPath, useNuxt, tryResolveModule, resolveAlias, resolvePath } from '@nuxt/kit'
import type { EditorSupportConfig, ExposeConfig, InjectPosition, ModuleOptions, ViewerConfig } from './types'

/**
 * Resolves all configPath values for an application
 *
 * @param path configPath for a layer
 * @returns array of resolved paths
 */
const resolveConfigPath = async (path: ModuleOptions['configPath']) =>
  Promise.all(
    (Array.isArray(path) ? path : [path])
      .filter(Boolean)
      .map((path) => findPath(path, { extensions: ['.js', '.cjs', '.mjs', '.ts'] }))
  ).then((paths) => paths.filter((p): p is string => Boolean(p)))

/**
 *
 * @param srcDir
 * @returns array of resolved content globs
 */
const resolveContentPaths = (srcDir: string, nuxtOptions = useNuxt().options) => {
  const r = (p: string) => p.startsWith(srcDir) ? p : resolve(srcDir, p)
  const extensionFormat = (s: string[]) => s.length > 1 ? `.{${s.join(',')}}` : `.${s.join('') || 'vue'}`

  const defaultExtensions = extensionFormat(['js', 'ts', 'mjs'])
  const sfcExtensions = extensionFormat(Array.from(new Set(['.vue', ...nuxtOptions.extensions])).map(e => e.replace(/^\.*/, '')))

  const importDirs = [...(nuxtOptions.imports?.dirs || [])].map(r)
  const [composablesDir, utilsDir] = [resolve(srcDir, 'composables'), resolve(srcDir, 'utils')]

  if (!importDirs.includes(composablesDir)) importDirs.push(composablesDir)
  if (!importDirs.includes(utilsDir)) importDirs.push(utilsDir)

  return [
    r(`components/**/*${sfcExtensions}`),
    ...(() => {
      if (nuxtOptions.components) {
        return (Array.isArray(nuxtOptions.components) ? nuxtOptions.components : typeof nuxtOptions.components === 'boolean' ? ['components'] : nuxtOptions.components.dirs).map(d => `${resolveAlias(typeof d === 'string' ? d : d.path)}/**/*${sfcExtensions}`)
      }
      return []
    })(),

    nuxtOptions.dir.layouts && r(`${nuxtOptions.dir.layouts}/**/*${sfcExtensions}`),
    ...([true, undefined].includes(nuxtOptions.pages) ? [r(`${nuxtOptions.dir.pages}/**/*${sfcExtensions}`)] : []),

    nuxtOptions.dir.plugins && r(`${nuxtOptions.dir.plugins}/**/*${defaultExtensions}`),
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
export const resolveModulePaths = async (configPath: ModuleOptions['configPath'], nuxt = useNuxt()) => {
  const mainPaths: [string[], string[]] = [await resolveConfigPath(configPath), resolveContentPaths(nuxt.options.srcDir, nuxt.options)]

  if (Array.isArray(nuxt.options._layers) && nuxt.options._layers.length > 1) {
    const layerPaths = await Promise.all(
      nuxt.options._layers.slice(1).map(async (layer): Promise<[string[], string[]]> => ([
        await resolveConfigPath(layer?.config?.tailwindcss?.configPath || join(layer.cwd, 'tailwind.config')),
        resolveContentPaths(layer?.config?.srcDir || layer.cwd, defu(layer.config, nuxt.options) as typeof nuxt.options)
      ])))

    layerPaths.forEach(([configPaths, contentPaths]) => {
      mainPaths[0].unshift(...configPaths)
      mainPaths[1].unshift(...contentPaths)
    })
  }

  return mainPaths
}

/**
 *
 * @param cssPath
 * @param nuxt
 * @returns [resolvedCss, loggerMessage]
 */
export async function resolveCSSPath(cssPath: Exclude<ModuleOptions['cssPath'], Array<any>>, nuxt = useNuxt()): Promise<[string | false, string]> {
  if (typeof cssPath === 'string') {
    const _cssPath = await resolvePath(cssPath, { extensions: ['.css', '.sass', '.scss', '.less', '.styl'] })

    return existsSync(_cssPath)
      ? [_cssPath, `Using Tailwind CSS from ~/${relative(nuxt.options.srcDir, _cssPath)}`]
      : await tryResolveModule('tailwindcss/package.json')
        .then(twLocation => twLocation ? [join(twLocation, '../tailwind.css'), 'Using default Tailwind CSS file'] : Promise.reject('Unable to resolve tailwindcss. Is it installed?'))
  } else {
    return [
      false,
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
export function resolveInjectPosition(css: string[], position: InjectPosition = 'first') {
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
