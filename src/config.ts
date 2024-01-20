import { addTemplate, useNuxt } from "@nuxt/kit";
import logger from "./logger";
import { resolveModulePaths } from "./resolvers";
import type { ModuleOptions, ResolvedTwConfig, TWConfig } from "./types";
import { relative } from "pathe";
import resolveConfig from "tailwindcss/resolveConfig";
import loadConfig from "tailwindcss/loadConfig";
import { configMerger } from "./runtime/utils";

type PartialTWConfig = Partial<TWConfig>

const makeHandler = <T extends PartialTWConfig>(proxyConfig: T, path: string[] = []): ProxyHandler<T> => ({
    get: (target, key: string) => {
        console.log('get', { key })

        return (typeof target[key] === 'object' && target[key] !== null)
            ? new Proxy(target[key], makeHandler(proxyConfig, path.concat(key)))
            : target[key]
    },

    set(target, key: string, value) {
        console.log('set', { key, value })

        if ((Array.isArray(target) && key === 'length') || JSON.stringify(target[key]) === JSON.stringify(value)) {
          return Reflect.set(target, key, value);
        }

        let result = value;
        (Array.isArray(target) ? path : path.concat(key)).reverse().forEach((k, idx) => {
          result = { [k]: Array.isArray(target) && idx === 0 ? [result] : result }
        })

        // @ts-ignore
        Object.entries(configMerger(proxyConfig, result)).forEach(([k, v]) => proxyConfig[k] = v)
        return Reflect.set(target, key, value)
    }
})

/**
 * Loads all possible Tailwind CSS configuration for a Nuxt project.
 *
 * @param moduleOptions configuration for the module
 * @param nuxt nuxt app
 * 
 * @returns template with all configs handled
 */
export default async function loadTwConfig(configPath: ModuleOptions['configPath'], inlineConfig: ModuleOptions['config'], nuxt = useNuxt()) {
    const [configPaths, contentPaths] = await resolveModulePaths(configPath, nuxt)
    const configProxies: [string, PartialTWConfig][] = configPaths.map((configPath) => [configPath, {}])

    const tailwindConfig = await Promise.all((
        configPaths.map(async (configPath, idx, paths) => {
            let _tailwindConfig: PartialTWConfig | undefined

            try {
                _tailwindConfig = loadConfig(configPath)
            } catch (e) {
                logger.warn(`Failed to load Tailwind config at: \`./${relative(nuxt.options.rootDir, configPath)}\``, e)
            }

            // Transform purge option from Array to object with { content }
            if (_tailwindConfig && !_tailwindConfig.content) {
                _tailwindConfig.content = _tailwindConfig.purge
            }

            await nuxt.callHook('tailwindcss:loadConfig', _tailwindConfig && new Proxy(_tailwindConfig, makeHandler(configProxies[idx][1])), configPath, idx, paths)
            return _tailwindConfig || {}
        }))
    ).then((configs) => configs.reduce(
        (prev, curr) => configMerger(curr, prev),
        // internal default tailwind config
        configMerger(inlineConfig, { content: contentPaths })
    ))

    // Allow extending tailwindcss config by other modules
    const configProxy: PartialTWConfig = {};
    await nuxt.callHook('tailwindcss:config', new Proxy(tailwindConfig, makeHandler(configProxy)))

    const resolvedConfig = resolveConfig(tailwindConfig as TWConfig)
    const resolvedConfigProxy: PartialTWConfig = {};
    await nuxt.callHook('tailwindcss:resolvedConfig', new Proxy(resolvedConfig, makeHandler(resolvedConfigProxy) as unknown as ProxyHandler<ResolvedTwConfig>))

    return addTemplate({
        filename: 'tailwind.config.mjs',
        write: true,
        getContents: () => {
            return [
                `import { defuFn as configMerger } from 'defu';`, // `import { configMerger } from '@nuxtjs/tailwindcss/dist/runtime/utils'`,
                configPaths.map((p, idx) => `import cfg${idx} from ${JSON.stringify(relative(nuxt.options.buildDir, p))};`).join('\n'),
                `\nconst inlineConfig = ${JSON.stringify(inlineConfig)};\n`,
                `const config = configMerger(`,
                `  { content: ${JSON.stringify(contentPaths)} },`,
                `  inlineConfig,`,
                `  ${JSON.stringify(resolvedConfigProxy)},`,
                `  ${JSON.stringify(configProxy)},`,
                `${configProxies.map(([_, p], idx) => `  cfg${idx}, ${JSON.stringify(p)}`).join(', \n')},`,
                `);\n`,
                `export default config;`
            ].join('\n')
        }
    })
}
