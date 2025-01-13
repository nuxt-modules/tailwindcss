import { join } from 'pathe'
import {
  defineNuxtModule,
  installModule,
  getNuxtVersion,
  resolvePath,
  useNuxt,
  createResolver,
  addImports,
  updateTemplates,
  addTemplate,
  isNuxtMajorVersion,
} from '@nuxt/kit'

import { name, version, configKey, compatibility } from '../package.json'
import * as resolvers from './resolvers'
import logger, { LogLevels } from './logger'
import { createExposeTemplates } from './expose'
import { setupViewer, exportViewer } from './viewer'
import { createInternalContext } from './internal-context/load'

import type { ModuleOptions, ModuleHooks } from './types'

export type { ModuleOptions, ModuleHooks } from './types'

const defaults = (nuxt = useNuxt()): ModuleOptions => ({
  configPath: [],
  cssPath: join(nuxt.options.dir.assets, 'css/tailwind.css'),
  config: {},
  viewer: nuxt.options.dev,
  exposeConfig: false,
  quiet: nuxt.options.logLevel === 'silent',
  editorSupport: false,
})

export default defineNuxtModule<ModuleOptions>({
  meta: { name, version, configKey, compatibility }, defaults,
  async setup(moduleOptions, nuxt) {
    if (moduleOptions.quiet) logger.level = LogLevels.silent

    // install postcss8 module on nuxt < 2.16
    if (Number.parseFloat(getNuxtVersion()) < 2.16) {
      await installModule('@nuxt/postcss8').catch((e) => {
        logger.error(`Error occurred while loading \`@nuxt/postcss8\` required for Nuxt ${getNuxtVersion()}, is it installed?`)
        throw e
      })
    }

    const ctx = await createInternalContext(moduleOptions, nuxt)

    if (moduleOptions.editorSupport) {
      const editorSupportConfig = resolvers.resolveEditorSupportConfig(moduleOptions.editorSupport)

      if ((editorSupportConfig.autocompleteUtil) && !isNuxtMajorVersion(2, nuxt)) {
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
      const injectPosition = await resolvers.resolveInjectPosition(resolvedNuxtCss, cssPathConfig?.injectPosition)
      nuxt.options.css.splice(injectPosition, 0, resolvedCss)
    }

    // workaround for nuxt2 middleware race condition
    let nuxt2ViewerConfig: Parameters<typeof setupViewer>[0] = join(nuxt.options.buildDir, 'tailwind/postcss.mjs')

    nuxt.hook('modules:done', async () => {
      const _config = await ctx.loadConfigs()

      const twConfig = ctx.generateConfig()
      ctx.registerHooks()

      nuxt2ViewerConfig = twConfig.dst || _config

      // expose resolved tailwind config as an alias
      if (moduleOptions.exposeConfig) {
        const exposeConfig = resolvers.resolveExposeConfig(moduleOptions.exposeConfig)
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
      if (nuxt.options.dev && !isNuxtMajorVersion(2, nuxt)) {
        // add tailwind-config-viewer endpoint
        if (moduleOptions.viewer) {
          const viewerConfig = resolvers.resolveViewerConfig(moduleOptions.viewer)
          setupViewer(twConfig.dst || _config, viewerConfig, nuxt)
        }
      }
      else {
        // production only
        if (!nuxt.options.dev) return

        if (moduleOptions.viewer) {
          const viewerConfig = resolvers.resolveViewerConfig(moduleOptions.viewer)

          exportViewer(twConfig.dst || addTemplate({ filename: 'tailwind.config/viewer-config.cjs', getContents: () => `module.exports = ${JSON.stringify(_config)}`, write: true }).dst, viewerConfig)
        }
      }
    })

    if (nuxt.options.dev && moduleOptions.viewer && isNuxtMajorVersion(2, nuxt)) {
      const viewerConfig = resolvers.resolveViewerConfig(moduleOptions.viewer)
      setupViewer(nuxt2ViewerConfig, viewerConfig, nuxt)
    }
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
