import { underline, yellow } from 'colorette'
import { eventHandler, sendRedirect } from 'h3'
import { addDevServerHandler, isNuxt2, isNuxt3, useNuxt } from '@nuxt/kit'
import { withTrailingSlash, withoutTrailingSlash, joinURL } from 'ufo'
import logger from './logger'
import { relative } from 'pathe'
import type { TWConfig, ViewerConfig } from './types'

export const setupViewer = async (twConfig: Partial<TWConfig>, config: ViewerConfig, nuxt = useNuxt()) => {
  const route = joinURL(nuxt.options.app?.baseURL, config.endpoint)
  // @ts-ignore
  const createServer = await import('tailwind-config-viewer/server/index.js').then(r => r.default || r) as any
  const routerPrefix = isNuxt3() ? route : undefined
  const _viewerDevMiddleware = createServer({ tailwindConfigProvider: () => twConfig, routerPrefix }).asMiddleware()
  const viewerDevMiddleware = eventHandler((event) => {
    const withoutSlash = withoutTrailingSlash(route)
    if (event.node?.req.url === withoutSlash || event.req.url === withoutSlash) {
      return sendRedirect(event, route, 301)
    }
    _viewerDevMiddleware(event.node?.req || event.req, event.node?.res || event.res)
  })
  if (isNuxt3()) { addDevServerHandler({ route, handler: viewerDevMiddleware }) }
  // @ts-ignore
  if (isNuxt2()) { nuxt.options.serverMiddleware.push({ route, handler: (req, res) => viewerDevMiddleware(new H3Event(req, res)) }) }
  nuxt.hook('listen', (_, listener) => {
    const viewerUrl = `${withoutTrailingSlash(listener.url)}${route}`.replace(/\/+/g, '/')
    logger.info(`Tailwind Viewer: ${underline(yellow(withTrailingSlash(viewerUrl)))}`)
  })
}

export const exportViewer = async (pathToConfig: string, config: ViewerConfig, nuxt = useNuxt()) => {
  if (!config.exportViewer) { return }
  // @ts-ignore
  const cli = await import('tailwind-config-viewer/cli/export.js').then(r => r.default || r) as any

  nuxt.hook('nitro:build:public-assets', (nitro) => {
    // nitro.options.prerender.ignore.push(config.endpoint);

    const dir = joinURL(nitro.options.output.publicDir, config.endpoint);
    cli(dir, pathToConfig)
    logger.success(`Exported viewer to ${yellow(relative(nuxt.options.srcDir, dir))}`)
  })
}
