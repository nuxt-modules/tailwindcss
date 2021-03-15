import { withoutTrailingSlash, withTrailingSlash } from 'ufo'
import createServer from 'tailwind-config-viewer/server'

const server = createServer({
  // @ts-ignore
  tailwindConfigProvider: () => process.nuxt ? process.nuxt.$config.tailwind.getConfig() : {}
}).asMiddleware()

export default (req, res) => {
  // @ts-ignore
  if (req.originalUrl === withoutTrailingSlash(process.nuxt.$config.tailwind.viewerPath)) {
    res.writeHead(301, { Location: withTrailingSlash(req.originalUrl) })
    res.end()
  }
  server(req, res)
}
