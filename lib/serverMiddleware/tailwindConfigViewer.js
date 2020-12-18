const { withoutTrailingSlash, withTrailingSlash } = require('@nuxt/ufo')
const createServer = require('tailwind-config-viewer/server')

const server = createServer({
  tailwindConfigProvider: () => process.nuxt ? process.nuxt.$config.tailwind.getConfig() : {}
}).asMiddleware()

module.exports = (req, res) => {
  if (req.originalUrl === withoutTrailingSlash(process.nuxt.$config.tailwind.viewerPath)) {
    res.writeHead(301, { Location: withTrailingSlash(req.originalUrl) })
    res.end()
  }
  server(req, res)
}
