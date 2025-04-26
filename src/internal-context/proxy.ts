import { diff } from 'ohash/utils'
import logger from '../logger'
import type { TWConfig } from '../types'
import { twCtx } from './context'

const UNSUPPORTED_VAL_STR = 'UNSUPPORTED_VAL_STR'
const JSONStringifyWithUnsupportedVals = (val: any) => JSON.stringify(val, (_, v) => ['function'].includes(typeof v) ? UNSUPPORTED_VAL_STR : v)
const JSONStringifyWithRegex = (obj: any) => JSON.stringify(obj, (_, v) => v instanceof RegExp ? `__REGEXP ${v.toString()}` : v)

export const createObjProxy = (configUpdatedHook: Record<string, string>, meta: ReturnType<typeof twCtx.use>['meta']) => {
  return (configPath: string, oldConfig: Partial<TWConfig>, newConfig: Partial<TWConfig>) =>
    diff(oldConfig, newConfig).forEach((change) => {
      const path = change.key.split('.').map(k => `[${JSON.stringify(k)}]`).join('')
      const newValue = change.newValue?.value

      switch (change.type) {
        case 'removed': configUpdatedHook[configPath] += `delete cfg${path};`
          break
        case 'added':
        case 'changed': {
          const resultingCode = `cfg${path} = ${JSONStringifyWithRegex(newValue)?.replace(/"__REGEXP (.*)"/g, (_, substr) => substr.replace(/\\"/g, '"')) || `cfg${path}`};`

          if (JSONStringifyWithUnsupportedVals(change.oldValue?.value) === JSONStringifyWithUnsupportedVals(newValue) || configUpdatedHook[configPath].endsWith(resultingCode)) {
            return
          }

          if (JSONStringifyWithUnsupportedVals(newValue).includes(`"${UNSUPPORTED_VAL_STR}"`) && !meta?.disableHMR) {
            logger.warn(
              `A hook has injected a non-serializable value in \`config${path}\`, so the Tailwind Config cannot be serialized. Falling back to providing the loaded configuration inlined directly to PostCSS loader..`,
              'Please consider using a configuration file/template instead (specifying in `configPath` of the module options) to enable additional support for IntelliSense and HMR.',
            )
            twCtx.set({ meta: { disableHMR: true } })
          }

          if (JSONStringifyWithRegex(newValue).includes('__REGEXP') && !meta?.disableHMR) {
            logger.warn(`A hook is injecting RegExp values in your configuration (check \`config${path}\`) which may be unsafely serialized. Consider moving your safelist to a separate configuration file/template instead (specifying in \`configPath\` of the module options)`)
          }

          configUpdatedHook[configPath] += resultingCode
        }
      }
    })
}
