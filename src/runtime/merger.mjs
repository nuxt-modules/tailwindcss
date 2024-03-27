import { createDefu } from 'defu'

const isJSObject = (value) => typeof value === 'object' && !Array.isArray(value)

/**
 * Merges Tailwind CSS configuration objects. This has special logic to merge Content as Array or Object.
 *
 * Read <https://tailwindcss.com/docs/content-configuration>.
 *
 * @type {(...p: Array<Partial<import('tailwindcss').Config> | Record<string | number | symbol, any>>) => Partial<import('tailwindcss').Config>}
 */
export default createDefu((obj, key, value) => {
  if (key === 'content') {
    if (isJSObject(obj[key]) && Array.isArray(value)) {
      obj[key]['files'] = [...(obj[key]['files'] || []), ...value]
      return true
    } else if (Array.isArray(obj[key]) && isJSObject(value)) {
      obj[key] = { ...value, files: [...obj[key], ...(value.files || [])] }
      return true
    }
  }

  // keeping arrayFn
  if (Array.isArray(obj[key]) && typeof value === 'function') {
    obj[key] = value(obj[key])
    return true
  }
})
