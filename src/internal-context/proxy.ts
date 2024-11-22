import logger from '../logger'
import type { TWConfig } from '../types'
import { twCtx } from './context'

const UNSUPPORTED_VAL_STR = 'UNSUPPORTED_VAL_STR'
const JSONStringifyWithUnsupportedVals = (val: any) => JSON.stringify(val, (_, v) => ['function'].includes(typeof v) ? UNSUPPORTED_VAL_STR : v)
const JSONStringifyWithRegex = (obj: any) => JSON.stringify(obj, (_, v) => v instanceof RegExp ? `__REGEXP ${v.toString()}` : v)

export const createObjProxy = (configUpdatedHook: Record<string, string>, meta: ReturnType<typeof twCtx.use>['meta']) => {
  const trackObjChanges = (configPath: string, path: (string | symbol)[] = []): ProxyHandler<Partial<TWConfig>> => ({
    get: (target, key: string) => {
      return (typeof target[key] === 'object' && target[key] !== null)
        ? new Proxy(target[key], trackObjChanges(configPath, path.concat(key)))
        : target[key]
    },

    set(target, key, value) {
      const cfgKey = path.concat(key).map(k => `[${JSON.stringify(k)}]`).join('')
      const resultingCode = `cfg${cfgKey} = ${JSONStringifyWithRegex(value)?.replace(/"__REGEXP (.*)"/g, (_, substr) => substr.replace(/\\"/g, '"')) || `cfg${cfgKey}`};`

      if (JSONStringifyWithUnsupportedVals(target[key as string]) === JSONStringifyWithUnsupportedVals(value) || configUpdatedHook[configPath].endsWith(resultingCode)) {
        return Reflect.set(target, key, value)
      }

      if (JSONStringifyWithUnsupportedVals(value).includes(`"${UNSUPPORTED_VAL_STR}"`) && !meta?.disableHMR) {
        logger.warn(
          `A hook has injected a non-serializable value in \`config${cfgKey}\`, so the Tailwind Config cannot be serialized. Falling back to providing the loaded configuration inlined directly to PostCSS loader..`,
          'Please consider using a configuration file/template instead (specifying in `configPath` of the module options) to enable additional support for IntelliSense and HMR.',
        )
        twCtx.set({ meta: { disableHMR: true } })
      }

      if (JSONStringifyWithRegex(value).includes('__REGEXP') && !meta?.disableHMR) {
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
