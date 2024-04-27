import { useNuxt } from '@nuxt/kit'
import { relative } from 'pathe'
import _loadConfig from 'tailwindcss/loadConfig.js'
import type { ModuleOptions, TWConfig } from './types'
import logger from './logger'
import configMerger from './runtime/merger.mjs'

export const checkUnsafeConfig = (config?: ModuleOptions['config'] | Partial<TWConfig>) => {
  if (!config) return

  if (
    'plugins' in config && Array.isArray(config.plugins)
    && config.plugins.find(p => typeof p === 'function' || typeof p?.handler === 'function')
  ) {
    return 'plugins'
  }

  if (config.content) {
    const invalidProperty = ['extract', 'transform'].find((i) => i in config.content! && typeof config.content![i as keyof ModuleOptions['config']['content']] === 'function' )

    if (invalidProperty) {
      return `content.${invalidProperty}`
    }
  }

  if (config.safelist) {
    // @ts-expect-error `s` is never
    const invalidIdx = inlineConfig.safelist.findIndex((s) => typeof s === 'object' && s.pattern instanceof RegExp)

    if (invalidIdx > -1) {
      return `safelist[${invalidIdx}]`
    }
  }
}

const trackObjChanges = (
  configOperations: Record<string, string>,
  configPath: string,
  path: (string | symbol)[] = []
): ProxyHandler<Partial<TWConfig>> => ({
  get: (target, key: string) => {
    return (typeof target[key] === 'object' && target[key] !== null)
      ? new Proxy(target[key], trackObjChanges(configOperations, configPath, path.concat(key)))
      : target[key]
  },

  set(target, key, value) {
    const resultingCode = `cfg${path.concat(key).map(k => `[${JSON.stringify(k)}]`).join('')} = ${JSON.stringify(value)};`

    if (JSON.stringify(target[key as string]) === JSON.stringify(value) || configOperations[configPath].endsWith(resultingCode)) {
      return Reflect.set(target, key, value)
    }

    configOperations[configPath] += resultingCode
    const reflectResult = Reflect.set(target, key, value)
    const unsafePropertyChange = checkUnsafeConfig(target)

    if (unsafePropertyChange) {
      logger.warn(
        `A hook updated property \`${unsafePropertyChange}\` to a non-serializable value. Falling back to providing the loaded configuration inlined directly to PostCSS loader..`,
        'Consider passing this configuration through a separate file (specifying in `configPath` of the module options) to enable additional support for IntelliSense and HMR.'
      )
    }

    return reflectResult
  },

  deleteProperty(target, key) {
    configOperations[configPath] += `delete cfg${path.concat(key).map(k => `[${JSON.stringify(k)}]`).join('')};`
    return Reflect.deleteProperty(target, key)
  },
})

export const createConfigLoader = (configOperations: Record<string, string>, configPaths: string[], defaultConfig: Partial<TWConfig> = {}, nuxt = useNuxt()) =>
  async () => {
    configPaths.forEach(p => configOperations[p] = '')

    const tailwindConfig = await Promise.all((
      configPaths.map(async (configPath, idx, paths) => {
        let _tailwindConfig: Partial<TWConfig> | undefined

        try {
          _tailwindConfig = configMerger(undefined, _loadConfig(configPath))
        }
        catch (e) {
          if (!configPath.startsWith(nuxt.options.buildDir)) {
            configOperations[configPath] = 'return {};'
            logger.warn(`Failed to load Tailwind config at: \`./${relative(nuxt.options.rootDir, configPath)}\``, e)
          }
          else {
            configOperations[configPath] = nuxt.options.dev ? 'return {};' : ''
          }
        }

        // Transform purge option from Array to object with { content }
        if (_tailwindConfig?.purge && !_tailwindConfig.content) {
          configOperations[configPath] += 'cfg.content = cfg.purge;'
        }

        await nuxt.callHook('tailwindcss:loadConfig', _tailwindConfig && new Proxy(_tailwindConfig, trackObjChanges(configOperations, configPath)), configPath, idx, paths)
        return _tailwindConfig || {}
      })),
    ).then(configs => configs.reduce(
      (prev, curr) => configMerger(curr, prev),
      defaultConfig
    )) as TWConfig

    // Allow extending tailwindcss config by other modules
    configOperations['main-config'] = ''
    await nuxt.callHook('tailwindcss:config', new Proxy(tailwindConfig, trackObjChanges(configOperations, 'main-config')))
    return tailwindConfig
  }
