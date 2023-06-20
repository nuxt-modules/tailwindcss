import { dirname, join } from 'pathe'
import { useNuxt, addTemplate } from '@nuxt/kit'
import { isJSObject, NON_ALPHANUMERIC_RE } from './utils'
import type { TWConfig } from './types'

/**
 * Creates MJS exports for properties of the config
 *
 * @param resolvedConfig tailwind config
 * @param maxLevel maximum level of depth
 * @param nuxt nuxt app
 */
export default function createTemplates (resolvedConfig: Partial<TWConfig>, maxLevel: number, nuxt = useNuxt()) {
  const dtsContent: Array<string> = []

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
