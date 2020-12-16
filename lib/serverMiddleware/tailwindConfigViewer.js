import { withoutTrailingSlash, withTrailingSlash } from '@nuxt/ufo'
import createServer from 'tailwind-config-viewer/server'

const server = createServer({
  tailwindConfigProvider: () => process.nuxt ? process.nuxt.$config.tailwind.getConfig() : {}
}).asMiddleware()

export default (req, res) => {
  if (req.originalUrl === withoutTrailingSlash(process.nuxt.$config.tailwind.viewerPath)) {
    res.writeHead(301, { Location: withTrailingSlash(req.originalUrl) })
    res.end()
  }
  server(req, res)
}
