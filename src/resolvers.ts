import { existsSync } from 'fs'
import { join, relative } from 'pathe'
import { addTemplate, createResolver, findPath, useNuxt } from '@nuxt/kit'
import type { Arrayable, InjectPosition, ModuleOptions } from './types'

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
  const extensionFormat = (s: string[]) => `.{${s.join(',')}}`
  const defaultExtensions = extensionFormat(['js', 'ts'])
  const sfcExtensions = extensionFormat(nuxt.options.extensions)

  return [
    // `${srcDir}/components/**/*`,
    ...(() => {
      if (nuxt.options.components) {
        return (Array.isArray(nuxt.options.components) ? nuxt.options.components : typeof nuxt.options.components === 'boolean' ? ['components'] : nuxt.options.components.dirs).map(d => createResolver(import.meta.url).resolve(typeof d === 'string' ? d : d.path))
      }
      return []
    })(),

    `${srcDir}/${nuxt.options.dir.layouts}/**/*${sfcExtensions}`,
    ...(nuxt.options.pages ? [`${srcDir}/${nuxt.options.dir.pages}/**/*${sfcExtensions}`] : []),

    `${srcDir}/${nuxt.options.plugins}/**/*${defaultExtensions}`,
    `${srcDir}/${nuxt.options.modules}/**/*${defaultExtensions}`,
    ...nuxt.options.modulesDir.map(m => `${srcDir}/${m}/**/*${defaultExtensions}`),
    ...(nuxt.options.imports.dirs || []).map(d => `${srcDir}/${d}/**/*${defaultExtensions}`),

    `${srcDir}/{A,a}pp*${sfcExtensions}`,
    `${srcDir}/{E,e}rror${sfcExtensions}`,
    `${srcDir}/app.config${defaultExtensions}`,
  ]
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
export function resolveCSSPath (cssPath: ModuleOptions['cssPath'], nuxt = useNuxt()): [string, string] {
  if (typeof cssPath === 'string') {
    return existsSync(cssPath)
      ? [cssPath, `Using Tailwind CSS from ~/${relative(nuxt.options.srcDir, cssPath)}`]
      : ['tailwindcss/tailwind.css', 'Using default Tailwind CSS file']
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
 * Resolve human-readable inject position specification into absolute index in the array
 *
 * @param css nuxt css config
 * @param position position to inject
 *
 * @returns index in the css array
 */
export function resolveInjectPosition (css: string[], position: InjectPosition) {
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
