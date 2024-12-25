import { colors } from 'consola/utils'
import { eventHandler, sendRedirect, H3Event } from 'h3'
import { addDevServerHandler, isNuxtMajorVersion, useNuxt } from '@nuxt/kit'
import { withTrailingSlash, withoutTrailingSlash, joinURL, cleanDoubleSlashes } from 'ufo'
import { relative } from 'pathe'
import logger from './logger'
import type { TWConfig, ViewerConfig } from './types'

export const setupViewer = async (twConfig: string | Partial<TWConfig>, config: ViewerConfig, nuxt = useNuxt()) => {
  const route = joinURL(nuxt.options.app?.baseURL, config.endpoint)
  const [routeWithSlash, routeWithoutSlash] = [withTrailingSlash(route), withoutTrailingSlash(route)]

  const viewerServer = await Promise.all([
    // @ts-expect-error untyped package export
    import('tailwind-config-viewer/server/index.js').then(r => r.default || r),
    typeof twConfig === 'string' ? import('tailwindcss/loadConfig.js').then(r => r.default || r).then(loadConfig => () => loadConfig(twConfig)) : () => twConfig,
  ]).then(([server, tailwindConfigProvider]) => server({ tailwindConfigProvider }).asMiddleware())
  const viewerDevMiddleware = eventHandler(event => viewerServer(event.node?.req || event.req, event.node?.res || event.res))

  if (!isNuxtMajorVersion(2, nuxt)) {
    addDevServerHandler({
      handler: eventHandler((event) => {
        if (event.path === routeWithoutSlash) {
          return sendRedirect(event, routeWithSlash, 301)
        }
      }),
    })
    addDevServerHandler({ route, handler: viewerDevMiddleware })
  }
  else {
    // @ts-expect-error untyped nuxt2 property
    nuxt.options.serverMiddleware.push(
      // @ts-expect-error untyped handler parameters
      (req, res, next) => {
        if (req.url === routeWithoutSlash) {
          return sendRedirect(new H3Event(req, res), routeWithSlash, 301)
        }

        next()
      },
      // @ts-expect-error untyped handler parameters
      { route, handler: (req, res) => viewerDevMiddleware(new H3Event(req, res)) },
    )
  }

  nuxt.hook('devtools:customTabs', (tabs: import('@nuxt/devtools').ModuleOptions['customTabs']) => {
    tabs?.push({
      title: 'Tailwind CSS',
      name: 'tailwindcss',
      icon: 'logos-tailwindcss-icon',
      category: 'modules',
      view: { type: 'iframe', src: route },
    })
  })

  const shouldLogUrl = 'devtools' in nuxt.options ? !nuxt.options.devtools.enabled : true

  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  shouldLogUrl && nuxt.hook('listen', (_, listener) => {
    const viewerUrl = cleanDoubleSlashes(joinURL(listener.url, config.endpoint))
    logger.info(`Tailwind Viewer: ${colors.underline(colors.yellow(withTrailingSlash(viewerUrl)))}`)
  })
}

export const exportViewer = async (twConfig: string, config: ViewerConfig, nuxt = useNuxt()) => {
  if (!config.exportViewer) {
    return
  }
  // @ts-expect-error no types for tailwind-config-viewer
  const cli = await import('tailwind-config-viewer/cli/export.js').then(r => r.default || r) as any

  nuxt.hook('nitro:build:public-assets', (nitro) => {
    const dir = joinURL(nitro.options.output.publicDir, config.endpoint)
    cli(dir, twConfig)
    logger.success(`Exported viewer to ${colors.yellow(relative(nuxt.options.srcDir, dir))}`)
  })
}
