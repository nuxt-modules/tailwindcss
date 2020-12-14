const createServer = require('tailwind-config-viewer/server')

module.exports = ({ path, tailwindConfig, addServerMiddleware }) => {
  // strip initial and trailing slash from path
  path = path.replace(/(^\/|\/$)/g, '').replace(/^\//)

  /**
   * Force redirect if requested path does not have trailing slash.
   * This is required for relative asset paths in the Tailwind
   * Config Viewer to load correctly.
   */
  addServerMiddleware({
    path,
    handler: (req, res, next) => {
      if (req.originalUrl === `/${path}`) {
        res.writeHead(301, { Location: `${path}/` })
        res.end()
      } else {
        next()
      }
    }
  })

  addServerMiddleware({
    path,
    handler: createServer({
      tailwindConfigProvider: () => tailwindConfig
    }).asMiddleware()
  })
}
