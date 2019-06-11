jest.setTimeout(60000)

const { join } = require('path')
const { Nuxt, Builder } = require('nuxt-edge')
const request = require('request-promise-native')
const getPort = require('get-port')
const logger = require('@/logger')

const config = require('../example/nuxt.config')
config.dev = false
config._build = true // imitate `nuxt build` comman

let nuxt, port

const url = path => `http://localhost:${port}${path}`
const get = path => request(url(path))

logger.mockTypes(() => jest.fn())

describe('ok', () => {
  beforeAll(async () => {
    nuxt = new Nuxt(config)
    await nuxt.ready()
    await new Builder(nuxt).build()
    port = await getPort()
    await nuxt.listen(port)
  })

  afterAll(async () => {
    await nuxt.close()
  })

  beforeEach(() => {
    logger.clear()
  })

  test('render', async () => {
    const html = await get('/')
    expect(html).toContain('Get the coolest t-shirts from our brand new store')
    expect(html).not.toContain('.bg-pink-700')
  })

  test('include tailwind.css file in project css', () => {
    expect(nuxt.options.css).toHaveLength(1)
    expect(nuxt.options.css).toContain(join(nuxt.options.srcDir, nuxt.options.dir.assets, 'css', 'tailwind.css'))
  })

  test('build', () => {
    expect(logger.info).toHaveBeenCalledWith('postcss-preset-env stage is set to 1 for supporting advanced css features')
    expect(nuxt.options.build.postcss.preset.stage).toBe(1)
    expect(nuxt.options.build.postcss.plugins).toBeDefined()
    expect(nuxt.options.build.postcss.plugins.tailwindcss).toBe(join(nuxt.options.srcDir, 'tailwind.config.js'))
  })
})
