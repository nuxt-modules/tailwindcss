import { dirname, join } from 'pathe'
import { useNuxt, addTemplate, addTypeTemplate } from '@nuxt/kit'
import type { ResolvedNuxtTemplate } from 'nuxt/schema'
import type { ExposeConfig, TWConfig } from './types'
import resolveConfig from 'tailwindcss/resolveConfig.js'

const NON_ALPHANUMERIC_RE = /^[0-9a-z]+$/i
const isJSObject = (value: any) => typeof value === 'object' && !Array.isArray(value)

/**
 * Creates MJS exports for properties of the config
 *
 * @param resolvedConfig tailwind config
 * @param maxLevel maximum level of depth
 * @param nuxt nuxt app
 *
 * @returns array of templates
 */
export default function createConfigTemplates(twConfig: Awaited<ReturnType<typeof import('./config')['default']>>, config: ExposeConfig, nuxt = useNuxt()) {
  const templates: ResolvedNuxtTemplate<any>[] = []
  const getTWConfig = (objPath: string[] = []) =>
    import(twConfig.dst).then((config: TWConfig) => resolveConfig(config))
      .catch(() => twConfig).then((c) => objPath.reduce((prev, curr) => prev[curr], c))

  const populateMap = (obj: any, path: string[] = [], level = 1) => {
    Object.entries(obj).forEach(([key, value = {} as any]) => {
      const subpathComponents = path.concat(key)
      const subpath = subpathComponents.join('/')

      if (
        level >= config.level || // if recursive call is more than desired
        !isJSObject(value) || // if its not an object, no more recursion required
        Object.keys(value).find(k => !k.match(NON_ALPHANUMERIC_RE)) // object has non-alphanumeric property (unsafe var name)
      ) {
        templates.push(addTemplate({
          filename: `tailwind.config/${subpath}.mjs`,
          getContents: async () => {
            const _value = await getTWConfig(subpathComponents)

            if (isJSObject(_value)) {
              const [validKeys, invalidKeys]: [string[], string[]] = [[], []]
              Object.keys(_value).forEach(i => (NON_ALPHANUMERIC_RE.test(i) ? validKeys : invalidKeys).push(i))

              return [
                `${validKeys.map(i => `const _${i} = ${JSON.stringify(_value[i])}`).join('\n')}`,
                `const config = { ${validKeys.map(i => `"${i}": _${i}, `).join('')}${invalidKeys.map(i => `"${i}": ${JSON.stringify(_value[i])}, `).join('')} }`,
                `export { config as default${validKeys.length > 0 ? ', _' : ''}${validKeys.join(', _')} }`
              ].join('\n')
            }
            return `export default ${JSON.stringify(_value, null, 2)}`
          },
          write: config.write
        }))
      } else {
        // recurse through nested objects
        populateMap(value, path.concat(key), level + 1)

        templates.push(addTemplate({
          filename: `tailwind.config/${subpath}.mjs`,
          getContents: async () => {
            const _value = await getTWConfig(subpathComponents)
            const values = Object.keys(_value)

            return [
              `${values.map(v => `import _${v} from "./${key}/${v}.mjs"`).join('\n')}`,
              `const config = { ${values.map(k => `"${k}": _${k}`).join(', ')} }`,
              `export { config as default${values.length > 0 ? ', _' : ''}${values.join(', _')} }`
            ].join('\n')
          },
          write: config.write
        }))
      }
    })
  }

  populateMap(twConfig)

  const template = addTemplate({
    filename: 'tailwind.config/index.mjs',
    getContents: async () => {
      const _tailwindConfig = await getTWConfig()
      const configOptions = Object.keys(_tailwindConfig)

      return [
        `${configOptions.map(v => `import ${v} from "#build/tailwind.config/${v}.mjs"`).join('\n')}`,
        `const config = { ${configOptions.join(', ')} }`,
        `export { config as default, ${configOptions.join(', ')} }`
      ].join('\n')
    },
    write: true
  })

  templates.push(addTypeTemplate({
    filename: 'types/tailwind.config.d.ts',
    getContents: async () => {
      const _tailwindConfig = await getTWConfig()

      const declareModule = (obj: any, path: string[] = [], level = 1) =>
        Object.entries(obj).map(([key, value = {} as any]): string => {
          const subpath = path.concat(key).join('/')
          if (
            level >= config.level || // if recursive call is more than desired
            !isJSObject(value) || // if its not an object, no more recursion required
            Object.keys(value).find(k => !k.match(NON_ALPHANUMERIC_RE)) // object has non-alphanumeric property (unsafe var name)
          ) {
            if (isJSObject(value)) {
              const [validKeys, invalidKeys]: [string[], string[]] = [[], []]
              Object.keys(value).forEach(i => (NON_ALPHANUMERIC_RE.test(i) ? validKeys : invalidKeys).push(i))

              return `declare module "${config.alias}/${subpath}" { ${validKeys.map(i => `export const _${i}: ${JSON.stringify(value[i])};`).join('')} const defaultExport: { ${validKeys.map(i => `"${i}": typeof _${i}, `).join('')}${invalidKeys.map(i => `"${i}": ${JSON.stringify(value[i])}, `).join('')} }; export default defaultExport; }\n`
            }

            return `declare module "${config.alias}/${subpath}" { const defaultExport: ${JSON.stringify(value)}; export default defaultExport; }\n`
          }

          const values = Object.keys(value)
          return declareModule(value, path.concat(key), level + 1).join('') + `declare module "${config.alias}/${subpath}" {${Object.keys(value).map(v => ` export const _${v}: typeof import("${config.alias}/${join(`${key}/${subpath}`, `../${v}`)}")["default"];`).join('')} const defaultExport: { ${values.map(k => `"${k}": typeof _${k}`).join(', ')} }; export default defaultExport; }\n`
        })

      const configOptions = Object.keys(_tailwindConfig)
      return declareModule(_tailwindConfig).join('') + `declare module "${config.alias}" {${configOptions.map(v => ` export const ${v}: typeof import("${join(config.alias, v)}")["default"];`).join('')} const defaultExport: { ${configOptions.map(v => `"${v}": typeof ${v}`)} }; export default defaultExport; }`
    }
  }))

  templates.push(template)
  nuxt.options.alias[config.alias] = dirname(template.dst)

  return templates.map((t) => t.dst)
}
