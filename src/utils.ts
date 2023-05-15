import { dirname, join } from 'pathe'
import { useNuxt, addTemplate, findPath } from '@nuxt/kit'
import type { Config } from 'tailwindcss'
import { createDefu } from 'defu'

const NON_ALPHANUMERIC_RE = /^[0-9a-z]+$/i
const isJSObject = (value: any) => typeof value === 'object' && !Array.isArray(value)

export const configMerger: (
  ...p: Array<Partial<Config> | Record<string | number | symbol, any>>
) => Partial<Config> = createDefu((obj, key, value) => {
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

/**
 * Resolves all configPath values for an application
 *
 * @param path configPath for a layer
 * @returns array of resolved paths
 */
export const resolveConfigPath = async (path: string | string[]) => (
  await Promise.all(
    (Array.isArray(path) ? path : [path])
      .filter(Boolean)
      .map((path) => findPath(path, { extensions: ['.js', '.cjs', '.mjs', '.ts'] }))
  )
).filter((i): i is string => Boolean(i))


export type InjectPosition = 'first' | 'last' | number | { after: string };

/**
 * Resolve human-readable inject position specification into absolute index in the array
 *
 * @param css nuxt css config
 * @param position position to inject
 *
 * @returns index in the css array
 */
export function resolveInjectPosition (css: string[], position: InjectPosition) {
  if (typeof (position) === 'number') {
    return ~~Math.min(position, css.length + 1)
  }

  if (typeof (position) === 'string') {
    switch (position) {
      case 'first': return 0
      case 'last': return css.length
      default: throw new Error('invalid literal: ' + position)
    }
  }

  if (position.after !== undefined) {
    const index = css.indexOf(position.after)
    if (index === -1) {
      throw new Error('`after` position specifies a file which does not exists on CSS stack: ' + position.after)
    }

    return index + 1
  }

  throw new Error('invalid position: ' + JSON.stringify(position))
}

/**
 * Creates MJS exports for properties of the config
 *
 * @param resolvedConfig tailwind config
 * @param maxLevel maximum level of depth
 * @param nuxt nuxt app
 */
export function createTemplates (resolvedConfig: Partial<Config>, maxLevel: number, nuxt = useNuxt()) {
  const dtsContent: string[] = []

  const populateMap = (obj: any, path: string[] = [], level = 1) => {
    Object.entries(obj).forEach(([key, value = {} as any]) => {
      const subpath = path.concat(key).join('/')

      if (
        level >= maxLevel || // if recursive call is more than desired
        !isJSObject(value) || // if its not an object, no more recursion required
        Object.keys(value).find(k => !k.match(NON_ALPHANUMERIC_RE)) // object has non-alphanumeric property (unsafe var name)
      ) {
        if (isJSObject(value)) {
          const [validKeys, invalidKeys]: [string[], string[]] = [[], []]
          Object.keys(value).forEach(i => (NON_ALPHANUMERIC_RE.test(i) ? validKeys : invalidKeys).push(i))

          addTemplate({
            filename: `tailwind.config/${subpath}.mjs`,
            getContents: () => `${validKeys.map(i => `const _${i} = ${JSON.stringify(value[i])}`).join('\n')}\nconst config = { ${validKeys.map(i => `"${i}": _${i}, `).join('')}${invalidKeys.map(i => `"${i}": ${JSON.stringify(value[i])}, `).join('')} }\nexport { config as default${validKeys.length > 0 ? ', _' : ''}${validKeys.join(', _')} }`
          })
          dtsContent.push(`declare module "#tailwind-config/${subpath}" { ${validKeys.map(i => `export const _${i}: ${JSON.stringify(value[i])};`).join('')} const defaultExport: { ${validKeys.map(i => `"${i}": typeof _${i}, `).join('')}${invalidKeys.map(i => `"${i}": ${JSON.stringify(value[i])}, `).join('')} }; export default defaultExport; }`)
        } else {
          addTemplate({
            filename: `tailwind.config/${subpath}.mjs`,
            getContents: () => `export default ${JSON.stringify(value, null, 2)}`
          })
          dtsContent.push(`declare module "#tailwind-config/${subpath}" { const defaultExport: ${JSON.stringify(value)}; export default defaultExport; }`)
        }
      } else {
        // recurse through nested objects
        populateMap(value, path.concat(key), level + 1)

        const values = Object.keys(value)
        addTemplate({
          filename: `tailwind.config/${subpath}.mjs`,
          getContents: () => `${values.map(v => `import _${v} from "./${key}/${v}.mjs"`).join('\n')}\nconst config = { ${values.map(k => `"${k}": _${k}`).join(', ')} }\nexport { config as default${values.length > 0 ? ', _' : ''}${values.join(', _')} }`
        })
        dtsContent.push(`declare module "#tailwind-config/${subpath}" {${Object.keys(value).map(v => ` export const _${v}: typeof import("#tailwind-config/${join(`${key}/${subpath}`, `../${v}`)}")["default"];`).join('')} const defaultExport: { ${values.map(k => `"${k}": typeof _${k}`).join(', ')} }; export default defaultExport; }`)
      }
    })
  }

  populateMap(resolvedConfig)
  const configOptions = Object.keys(resolvedConfig)

  const template = addTemplate({
    filename: 'tailwind.config/index.mjs',
    getContents: () => `${configOptions.map(v => `import ${v} from "#build/tailwind.config/${v}.mjs"`).join('\n')}\nconst config = { ${configOptions.join(', ')} }\nexport { config as default, ${configOptions.join(', ')} }`,
    write: true
  })

  dtsContent.push(`declare module "#tailwind-config" {${configOptions.map(v => ` export const ${v}: typeof import("${join('#tailwind-config', v)}")["default"];`).join('')} const defaultExport: { ${configOptions.map(v => `"${v}": typeof ${v}`)} }; export default defaultExport; }`)
  const typesTemplate = addTemplate({
    filename: 'tailwind.config.d.ts',
    getContents: () => dtsContent.join('\n'),
    write: true
  })

  nuxt.options.alias['#tailwind-config'] = dirname(template.dst)
  nuxt.hook('prepare:types', (opts) => {
    opts.references.push({ path: typesTemplate.dst })
  })
}
