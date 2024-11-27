import { createDefu } from 'defu'
import { klona } from 'klona'
import type { TWConfig } from './types'

const isJSObject = (value: any) => typeof value === 'object' && !Array.isArray(value)

type Input = Partial<TWConfig> | Record<PropertyKey, any> | null | undefined

/**
 * Merges Tailwind CSS configuration objects. This has special logic to merge Content as Array or Object.
 *
 * Read <https://tailwindcss.com/docs/content-configuration>.
 */
export default (base: Input, ...defaults: Input[]): Partial<TWConfig> => {
  if (!base) {
    return klona(defaults[0]) as Partial<TWConfig>
  }

  return createDefu((obj, key, value) => {
    if (key === 'content') {
      if (isJSObject(obj[key]) && Array.isArray(value)) {
        obj[key] = { ...obj[key], files: [...(obj[key]['files'] || []), ...value] }
        return true
      }
      else if (Array.isArray(obj[key]) && isJSObject(value)) {
        obj[key] = { ...value, files: [...obj[key], ...(value.files || [])] }
        return true
      }

      // keeping arrayFn
      if (obj[key] && typeof value === 'function') {
        obj[key] = value(Array.isArray(obj[key]) ? obj[key] : obj[key]['files'])
        return true
      }
      if (typeof obj[key] === 'function' && value) {
        obj[key] = obj[key](Array.isArray(value) ? value : value['files'])
        return true
      }
    }
  })(klona(base), ...defaults.map(klona))
}
