import { join, relative } from 'pathe'
import { watch } from 'chokidar'

import {
  defineNuxtModule,
  installModule,
  isNuxt2,
  useLogger,
  getNuxtVersion,
  resolvePath,
  addVitePlugin,
  useNuxt,
  addTemplate
} from '@nuxt/kit'

// @ts-expect-error
import defaultTailwindConfig from 'tailwindcss/stubs/config.simple.js'
import resolveConfig from 'tailwindcss/resolveConfig.js'
import loadConfig from 'tailwindcss/loadConfig.js'

import { configMerger } from './utils'
import {
  resolveModulePaths,
  resolveCSSPath,
  resolveInjectPosition
} from './resolvers'
import createTemplates from './templates'
import vitePlugin from './vite-hmr'
import setupViewer from './viewer'
import { name, version, configKey, compatibility } from '../package.json'

import type { ModuleOptions, TWConfig } from './types'
export type { ModuleOptions } from './types'

const logger = useLogger('nuxt:tailwindcss')

const defaults = (nuxt = useNuxt()): ModuleOptions => ({
  configPath: 'tailwind.config',
  cssPath: join(nuxt.options.dir.assets, 'css/tailwind.css'),
  config: defaultTailwindConfig,
  viewer: true,
  exposeConfig: false,
  exposeLevel: 2,
  injectPosition: 'first',
  disableHmrHotfix: false
})

export default defineNuxtModule<ModuleOptions>({
  meta: { name, version, configKey, compatibility }, defaults,
  async setup (moduleOptions, nuxt) {
    const [configPaths, contentPaths] = await resolveModulePaths(moduleOptions.configPath, nuxt)

    const tailwindConfig = await Promise.all((
      configPaths.map(async (configPath, idx, paths) => {
        let _tailwindConfig: Partial<TWConfig> | undefined
        try {
          _tailwindConfig = loadConfig(configPath)
        } catch (e) {
          logger.warn(`Failed to load Tailwind config at: \`./${relative(nuxt.options.rootDir, configPath)}\``, e)
        }

        // Transform purge option from Array to object with { content }
        if (_tailwindConfig && !_tailwindConfig.content) {
          _tailwindConfig.content = _tailwindConfig.purge
        }

        await nuxt.callHook('tailwindcss:loadConfig', _tailwindConfig, configPath, idx, paths)
        return _tailwindConfig || {}
      }))
    ).then((configs) => configs.reduce(
      (prev, curr) => configMerger(curr, prev),
      // internal default tailwind config
      configMerger(moduleOptions.config, { content: contentPaths })
    ))

    // Allow extending tailwindcss config by other modules
    await nuxt.callHook('tailwindcss:config', tailwindConfig)

    const resolvedConfig = resolveConfig(tailwindConfig as TWConfig)
    await nuxt.callHook('tailwindcss:resolvedConfig', resolvedConfig)

    // Expose resolved tailwind config as an alias
    // https://tailwindcss.com/docs/configuration/#referencing-in-javascript
    if (moduleOptions.exposeConfig) {
      createTemplates(resolvedConfig, moduleOptions.exposeLevel, nuxt)
      isNuxt2() && addTemplate({ filename: 'tailwind.config.cjs', getContents: () => `module.exports = ${JSON.stringify(resolvedConfig, null, 2)}` })
    }

    // Compute tailwindConfig hash
    tailwindConfig._hash = String(Date.now())


    /** CSS file handling */
    const cssPath = typeof moduleOptions.cssPath === 'string' ? await resolvePath(moduleOptions.cssPath, { extensions: ['.css', '.sass', '.scss', '.less', '.styl'] }) : false
    const [resolvedCss, loggerInfo] = await resolveCSSPath(cssPath, nuxt)
    logger.info(loggerInfo)

    nuxt.options.css = nuxt.options.css ?? []
    const resolvedNuxtCss = await Promise.all(nuxt.options.css.map((p: any) => resolvePath(p.src ?? p)))

    // Inject only if this file isn't listed already by user (e.g. user may put custom path both here and in css):
    if (!resolvedNuxtCss.includes(resolvedCss)) {
      let injectPosition: number
      try {
        injectPosition = resolveInjectPosition(nuxt.options.css, moduleOptions.injectPosition)
      } catch (e: any) {
        throw new Error('failed to resolve Tailwind CSS injection position: ' + e.message)
      }

      nuxt.options.css.splice(injectPosition, 0, resolvedCss)
    }


    /** PostCSS 8 support for Nuxt 2 */

    // Setup postcss plugins
    // https://tailwindcss.com/docs/using-with-preprocessors#future-css-features
    const postcssOptions =
      nuxt.options.postcss || /* nuxt 3 */ /* @ts-ignore */
      nuxt.options.build.postcss.postcssOptions || /* older nuxt3 */ /* @ts-ignore */
      nuxt.options.build.postcss as any
    postcssOptions.plugins = postcssOptions.plugins || {}
    postcssOptions.plugins['tailwindcss/nesting'] = postcssOptions.plugins['tailwindcss/nesting'] ?? {}
    postcssOptions.plugins['postcss-custom-properties'] = postcssOptions.plugins['postcss-custom-properties'] ?? {}
    postcssOptions.plugins.tailwindcss = tailwindConfig

    // install postcss8 module on nuxt < 2.16
    if (parseFloat(getNuxtVersion()) < 2.16) {
      await installModule('@nuxt/postcss8')
    }


    // enabled only in development
    if (nuxt.options.dev) {
      // Watch the Tailwind config file to restart the server
      if (isNuxt2()) {
        nuxt.options.watch = nuxt.options.watch || []
        configPaths.forEach(path => nuxt.options.watch.push(path))
      } else if (Array.isArray(nuxt.options.watch)) {
        configPaths.forEach(path => nuxt.options.watch.push(relative(nuxt.options.srcDir, path)))
      } else {
        const watcher = watch(configPaths, { depth: 0 }).on('change', (path) => {
          logger.info(`Tailwind config changed: ${path}`)
          logger.warn('Please restart the Nuxt server to apply changes or upgrade to latest Nuxt for automatic restart.')
        })
        nuxt.hook('close', () => watcher.close())
      }

      // Insert Vite plugin to work around HMR issue
      if (!moduleOptions.disableHmrHotfix) {
        addVitePlugin(vitePlugin(tailwindConfig, nuxt.options.rootDir, resolvedCss))
      }

      // Add _tailwind config viewer endpoint
      // TODO: Fix `addServerHandler` on Nuxt 2 w/o Bridge
      if (moduleOptions.viewer) {
        setupViewer(tailwindConfig, nuxt)

        nuxt.hook('devtools:customTabs', (tabs) => {
          tabs.push({
            title: 'TailwindCSS',
            name: 'tailwindcss',
            icon: 'logos-tailwindcss-icon',
            view: {
              type: 'iframe',
              src: '/_tailwind/'
            }
          })
        })
      }
    }
  }

})

declare module '@nuxt/schema' {
  interface NuxtHooks {
    'tailwindcss:config': (tailwindConfig: Partial<TWConfig>) => void;
    'tailwindcss:loadConfig': (tailwindConfig: Partial<TWConfig> | undefined, configPath: string, index: number, configPaths: string[]) => void;
    'tailwindcss:resolvedConfig': (tailwindConfig: ReturnType<typeof resolveConfig<TWConfig>>) => void;
  }
}
