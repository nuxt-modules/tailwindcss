import { existsSync } from 'node:fs'
import { defu } from 'defu'
import { join, relative } from 'pathe'
import { useNuxt, tryResolveModule, resolvePath } from '@nuxt/kit'
import type { EditorSupportConfig, ExposeConfig, InjectPosition, ModuleOptions, ViewerConfig } from './types'

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
  }
  else {
    return [
      false,
      'No Tailwind CSS file found. Skipping...',
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
