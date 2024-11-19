import logger from '../logger'
import type { TWConfig } from '../types'
import { twCtx } from './context'

const CONFIG_TEMPLATE_NAME = 'tailwind.config.cjs'
const JSONStringifyWithRegex = (obj: any) => JSON.stringify(obj, (_, v) => v instanceof RegExp ? `__REGEXP ${v.toString()}` : v)

export const createObjProxy = (configUpdatedHook: Record<string, string>) => {
  const ctx = twCtx.tryUse()

  const trackObjChanges = (configPath: string, path: (string | symbol)[] = []): ProxyHandler<Partial<TWConfig>> => ({
    get: (target, key: string) => {
      return (typeof target[key] === 'object' && target[key] !== null)
        ? new Proxy(target[key], trackObjChanges(configPath, path.concat(key)))
        : target[key]
    },

    set(target, key, value) {
      const cfgKey = path.concat(key).map(k => `[${JSON.stringify(k)}]`).join('')
      const resultingCode = `cfg${cfgKey} = ${JSONStringifyWithRegex(value)?.replace(/"__REGEXP (.*)"/g, (_, substr) => substr.replace(/\\"/g, '"')) || `cfg${cfgKey}`};`
      const functionalStringify = (val: any) => JSON.stringify(val, (_, v) => ['function'].includes(typeof v) ? CONFIG_TEMPLATE_NAME + 'ns' : v)

      if (functionalStringify(target[key as string]) === functionalStringify(value) || configUpdatedHook[configPath].endsWith(resultingCode)) {
        return Reflect.set(target, key, value)
      }

      if (functionalStringify(value).includes(`"${CONFIG_TEMPLATE_NAME + 'ns'}"`) && !ctx?.meta?.disableHMR) {
        logger.warn(
          `A hook has injected a non-serializable value in \`config${cfgKey}\`, so the Tailwind Config cannot be serialized. Falling back to providing the loaded configuration inlined directly to PostCSS loader..`,
          'Please consider using a configuration file/template instead (specifying in `configPath` of the module options) to enable additional support for IntelliSense and HMR.',
        )
        twCtx.set({ meta: { disableHMR: true } })
      }

      if (JSONStringifyWithRegex(value).includes('__REGEXP') && !ctx?.meta?.disableHMR) {
        logger.warn(`A hook is injecting RegExp values in your configuration (check \`config${cfgKey}\`) which may be unsafely serialized. Consider moving your safelist to a separate configuration file/template instead (specifying in \`configPath\` of the module options)`)
      }

      configUpdatedHook[configPath] += resultingCode
      return Reflect.set(target, key, value)
    },

    deleteProperty(target, key) {
      configUpdatedHook[configPath] += `delete cfg${path.concat(key).map(k => `[${JSON.stringify(k)}]`).join('')};`
      return Reflect.deleteProperty(target, key)
    },
  })

  return trackObjChanges
}
