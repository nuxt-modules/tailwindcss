import { underline, yellow } from 'colorette'
import { eventHandler, sendRedirect } from 'h3'
import { addDevServerHandler, isNuxt2, isNuxt3, useLogger, useNuxt } from '@nuxt/kit'
import { withTrailingSlash, withoutTrailingSlash, joinURL } from 'ufo'
import type { TWConfig } from './types'

export default async function (twConfig: Partial<TWConfig>, nuxt = useNuxt()) {
  const route = joinURL(nuxt.options.app?.baseURL, '/_tailwind')
  // @ts-ignore
  const createServer = await import('tailwind-config-viewer/server/index.js').then(r => r.default || r) as any
  const routerPrefix = isNuxt3() ? route : undefined
  const _viewerDevMiddleware = createServer({ tailwindConfigProvider: () => twConfig, routerPrefix }).asMiddleware()
  const viewerDevMiddleware = eventHandler((event) => {
    if (event.req.url === withoutTrailingSlash(route)) {
      return sendRedirect(event, withTrailingSlash(event.req.url), 301)
    }
    _viewerDevMiddleware(event.req, event.res)
  })
  if (isNuxt3()) { addDevServerHandler({ route, handler: viewerDevMiddleware }) }
  // @ts-ignore
  if (isNuxt2()) { nuxt.options.serverMiddleware.push({ route, handler: (req, res) => viewerDevMiddleware(new H3Event(req, res)) }) }
  nuxt.hook('listen', (_, listener) => {
    const viewerUrl = `${withoutTrailingSlash(listener.url)}${route}`.replace(/\/+/g, '/')
    useLogger('nuxt:tailwindcss').info(`Tailwind Viewer: ${underline(yellow(withTrailingSlash(viewerUrl)))}`)
  })
}
