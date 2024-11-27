/** @typedef {import('tailwindcss').Config} TWConfig */

import { createDefu } from 'defu'
import { klona } from 'klona'

const isJSObject = value => typeof value === 'object' && !Array.isArray(value)

/**
 * Merges Tailwind CSS configuration objects. This has special logic to merge Content as Array or Object.
 *
 * Read <https://tailwindcss.com/docs/content-configuration>.
 *
 * @type {(...p: Array<Partial<TWConfig> | Record<PropertyKey, any> | null | undefined>) => Partial<TWConfig>}
 */
export default (base, ...defaults) => {
  if (!base) {
    return klona(defaults[0])
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
