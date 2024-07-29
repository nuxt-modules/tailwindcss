import { join } from 'pathe'
import { withTrailingSlash } from 'ufo'
import {
  defineNuxtModule,
  installModule,
  isNuxt2,
  getNuxtVersion,
  resolvePath,
  useNuxt,
  createResolver,
  addImports,
  updateTemplates,
  addTemplate,
} from '@nuxt/kit'

// @ts-expect-error no declaration file
import defaultTailwindConfig from 'tailwindcss/stubs/config.simple.js'

import { name, version, configKey, compatibility } from '../package.json'
import * as resolvers from './resolvers'
import logger, { LogLevels } from './logger'
import { createExposeTemplates } from './expose'
import { setupViewer, exportViewer } from './viewer'
import { createInternalContext } from './context'

import type { ModuleOptions, ModuleHooks } from './types'

export type { ModuleOptions, ModuleHooks } from './types'

const deprecationWarnings = (moduleOptions: ModuleOptions, nuxt = useNuxt()) =>
  ([
    ['addTwUtil', 'Use `editorSupport.autocompleteUtil` instead.'],
    ['exposeLevel', 'Use `exposeConfig.level` instead.'],
    ['injectPosition', `Use \`cssPath: [${
      moduleOptions.cssPath === join(nuxt.options.dir.assets, 'css/tailwind.css')
        ? '"~/assets/css/tailwind.css"'
        : typeof moduleOptions.cssPath === 'string' ? `"${moduleOptions.cssPath}"` : moduleOptions.cssPath
    }, { injectPosition: ${JSON.stringify(moduleOptions.injectPosition)} }]\` instead.`],
  ] satisfies Array<[keyof ModuleOptions, string]>).forEach(
    ([dOption, alternative]) => moduleOptions[dOption] !== undefined && logger.warn(`Deprecated \`${dOption}\`. ${alternative}`),
  )

const defaults = (nuxt = useNuxt()): ModuleOptions => ({
  configPath: 'tailwind.config',
  cssPath: join(nuxt.options.dir.assets, 'css/tailwind.css'),
  config: defaultTailwindConfig,
  viewer: true,
  exposeConfig: false,
  quiet: nuxt.options.logLevel === 'silent',
  editorSupport: false,
})

export default defineNuxtModule<ModuleOptions>({
  meta: { name, version, configKey, compatibility }, defaults,
  async setup(moduleOptions, nuxt) {
    if (moduleOptions.quiet) logger.level = LogLevels.silent
    deprecationWarnings(moduleOptions, nuxt)

    // install postcss8 module on nuxt < 2.16
    if (Number.parseFloat(getNuxtVersion()) < 2.16) {
      await installModule('@nuxt/postcss8').catch((e) => {
        logger.error(`Error occurred while loading \`@nuxt/postcss8\` required for Nuxt ${getNuxtVersion()}, is it installed?`)
        throw e
      })
    }

    const ctx = await createInternalContext(moduleOptions, nuxt)

    if (moduleOptions.editorSupport || moduleOptions.addTwUtil) {
      const editorSupportConfig = resolvers.resolveEditorSupportConfig(moduleOptions.editorSupport)

      if ((editorSupportConfig.autocompleteUtil || moduleOptions.addTwUtil) && !isNuxt2()) {
        addImports({
          name: 'autocompleteUtil',
          from: createResolver(import.meta.url).resolve('./runtime/utils'),
          as: 'tw',
          ...(typeof editorSupportConfig.autocompleteUtil === 'object' ? editorSupportConfig.autocompleteUtil : {}),
        })
      }
    }

    // css file handling
    const [cssPath, cssPathConfig] = Array.isArray(moduleOptions.cssPath) ? moduleOptions.cssPath : [moduleOptions.cssPath]
    const [resolvedCss, loggerInfo] = await resolvers.resolveCSSPath(cssPath, nuxt)
    logger.info(loggerInfo)

    nuxt.options.css = nuxt.options.css ?? []
    const resolvedNuxtCss = (resolvedCss && await Promise.all(nuxt.options.css.map((p: any) => resolvePath(p.src ?? p)))) || []

    // inject only if this file isn't listed already by user
    if (resolvedCss && !resolvedNuxtCss.includes(resolvedCss)) {
      let injectPosition: number
      try {
        injectPosition = resolvers.resolveInjectPosition(nuxt.options.css, cssPathConfig?.injectPosition || moduleOptions.injectPosition)
      }
      catch (e: any) {
        throw new Error('failed to resolve Tailwind CSS injection position: ' + e.message)
      }

      nuxt.options.css.splice(injectPosition, 0, resolvedCss)
    }

    nuxt.hook('modules:done', async () => {
      const _config = await ctx.loadConfig()

      const twConfig = ctx.generateConfig()
      ctx.registerHooks()

      // expose resolved tailwind config as an alias
      if (moduleOptions.exposeConfig) {
        const exposeConfig = resolvers.resolveExposeConfig({ level: moduleOptions.exposeLevel, ...(typeof moduleOptions.exposeConfig === 'object' ? moduleOptions.exposeConfig : {}) })
        const exposeTemplates = createExposeTemplates(exposeConfig)
        nuxt.hook('tailwindcss:internal:regenerateTemplates', () => updateTemplates({ filter: template => exposeTemplates.includes(template.dst) }))
      }

      // setup postcss plugins (for Nuxt 2/bridge/3)
      const postcssOptions
        /* nuxt 3 */
        = nuxt.options.postcss
        // @ts-expect-error older nuxt3
        || nuxt.options.build.postcss.postcssOptions
        // @ts-expect-error nuxt 2 type
        || nuxt.options.build.postcss as any
      postcssOptions.plugins = {
        ...(postcssOptions.plugins || {}),
        'tailwindcss/nesting': postcssOptions.plugins?.['tailwindcss/nesting'] ?? {},
        'tailwindcss': twConfig.dst satisfies string || _config,
      }

      // enabled only in development
      if (nuxt.options.dev) {
        // add tailwind-config-viewer endpoint
        if (moduleOptions.viewer) {
          const viewerConfig = resolvers.resolveViewerConfig(moduleOptions.viewer)
          setupViewer(twConfig.dst || _config, viewerConfig, nuxt)

          nuxt.hook('devtools:customTabs', (tabs: import('@nuxt/devtools').ModuleOptions['customTabs']) => {
            tabs?.push({
              title: 'Tailwind CSS',
              name: 'tailwindcss',
              icon: 'logos-tailwindcss-icon',
              category: 'modules',
              view: {
                type: 'iframe',
                src: withTrailingSlash(nuxt.options.app?.baseURL + viewerConfig.endpoint),
              },
            })
          })
        }
      }
      else {
        // production only
        if (moduleOptions.viewer) {
          const viewerConfig = resolvers.resolveViewerConfig(moduleOptions.viewer)

          exportViewer(twConfig.dst || addTemplate({ filename: 'tailwind.config/viewer-config.cjs', getContents: () => `module.exports = ${JSON.stringify(_config)}`, write: true }).dst, viewerConfig)
        }
      }
    })
  },
})

declare module 'nuxt/schema' {
  interface NuxtHooks extends ModuleHooks {
    'tailwindcss:internal:regenerateTemplates': (data?: { configTemplateUpdated?: boolean }) => void | Promise<void>
  }
}

declare module '@nuxt/schema' {
  interface NuxtHooks extends ModuleHooks {
    'tailwindcss:internal:regenerateTemplates': (data?: { configTemplateUpdated?: boolean }) => void | Promise<void>
  }
}
