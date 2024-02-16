import { colors } from 'consola/utils'
import { eventHandler, sendRedirect, H3Event } from 'h3'
import { addDevServerHandler, isNuxt2, isNuxt3, useNuxt } from '@nuxt/kit'
import { withTrailingSlash, withoutTrailingSlash, joinURL, cleanDoubleSlashes } from 'ufo'
import loadConfig from 'tailwindcss/loadConfig.js'
import logger from './logger'
import { relative } from 'pathe'
import type { ViewerConfig } from './types'

export const setupViewer = async (twConfig: Awaited<ReturnType<typeof import('./config')['default']>>, config: ViewerConfig, nuxt = useNuxt()) => {
  const route = joinURL(nuxt.options.app?.baseURL, config.endpoint)
  const [routeWithSlash, routeWithoutSlash] = [withTrailingSlash(route), withoutTrailingSlash(route)]

  // @ts-expect-error untyped package export
  const viewerServer = (await import('tailwind-config-viewer/server/index.js').then(r => r.default || r))({ tailwindConfigProvider: () => loadConfig(twConfig.dst) }).asMiddleware()
  const viewerDevMiddleware = eventHandler(event => viewerServer(event.node?.req || event.req, event.node?.res || event.res))

  if (isNuxt3()) {
    addDevServerHandler({
      handler: eventHandler(event => {
        if (event.path === routeWithoutSlash) {
          return sendRedirect(event, routeWithSlash, 301)
        }
      })
    })
    addDevServerHandler({ route, handler: viewerDevMiddleware })
  }

  if (isNuxt2()) {
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
      { route, handler: (req, res) => viewerDevMiddleware(new H3Event(req, res)) }
    )
  }

  nuxt.hook('listen', (_, listener) => {
    const viewerUrl = cleanDoubleSlashes(joinURL(listener.url, config.endpoint))
    logger.info(`Tailwind Viewer: ${colors.underline(colors.yellow(withTrailingSlash(viewerUrl)))}`)
  })
}

export const exportViewer = async (twConfig: Awaited<ReturnType<typeof import('./config')['default']>>, config: ViewerConfig, nuxt = useNuxt()) => {
  if (!config.exportViewer) { return }
  // @ts-ignore
  const cli = await import('tailwind-config-viewer/cli/export.js').then(r => r.default || r) as any

  nuxt.hook('nitro:build:public-assets', (nitro) => {
    // nitro.options.prerender.ignore.push(config.endpoint);

    const dir = joinURL(nitro.options.output.publicDir, config.endpoint)
    cli(dir, twConfig.dst)
    logger.success(`Exported viewer to ${colors.yellow(relative(nuxt.options.srcDir, dir))}`)
  })
}
