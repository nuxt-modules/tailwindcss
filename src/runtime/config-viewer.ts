import { withoutTrailingSlash, withTrailingSlash } from 'ufo'
import createServer from 'tailwind-config-viewer/server/index.js'
import config from '#config'

const serverMiddleware = createServer({ tailwindConfigProvider: () => config.tailwindcss.tailwindConfig }).asMiddleware()

export default (req, res) => {
  // @ts-ignore
  if (req.originalUrl === withoutTrailingSlash(config.tailwindcss.viewerPath)) {
    // @ts-ignore
    res.writeHead(301, { Location: withTrailingSlash(req.originalUrl) })
    res.end()
  }
  serverMiddleware(req, res)
}
