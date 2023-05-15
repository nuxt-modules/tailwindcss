import { createDefu } from 'defu'
import type { TWConfig } from './types'

export const NON_ALPHANUMERIC_RE = /^[0-9a-z]+$/i
export const isJSObject = (value: any) => typeof value === 'object' && !Array.isArray(value)

export const configMerger: (
  ...p: Array<Partial<TWConfig> | Record<string | number | symbol, any>>
) => Partial<TWConfig> = createDefu((obj, key, value) => {
  if (key === 'content') {
    if (isJSObject(obj[key]) && Array.isArray(value)) {
      obj[key]['files'] = [...(obj[key]['files'] || []), ...value]
      return true
    } else if (Array.isArray(obj[key]) && isJSObject(value)) {
      obj[key] = { ...value, files: [...obj[key], ...(value.files || [])]}
      return true
    }
  }

  // keeping arrayFn
  if (Array.isArray(obj[key]) && typeof value === "function") {
    obj[key] = value(obj[key])
    return true
  }
})
