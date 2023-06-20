import { isAbsolute, resolve } from 'pathe'
import type { Plugin as VitePlugin } from 'vite'
import type { TWConfig } from './types'
import micromatch from 'micromatch'

export default function (tailwindConfig: Partial<TWConfig> = {}, rootDir: string, cssPath: string): VitePlugin {
  const resolvedContent = ((Array.isArray(tailwindConfig.content) ? tailwindConfig.content : tailwindConfig.content?.files || []).filter(f => typeof f === 'string') as Array<string>).map(f => !isAbsolute(f) ? resolve(rootDir, f) : f)

  return {
    name: 'nuxt:tailwindcss',
    handleHotUpdate (ctx): void {
      if (resolvedContent.findIndex(c => micromatch.isMatch(ctx.file, c)) === -1) {
        return
      }

      const extraModules = ctx.server.moduleGraph.getModulesByFile(cssPath) || new Set()
      const timestamp = +Date.now()

      for (const mod of extraModules) {
        // This will invalidate Vite cache (e.g. next page reload will be fine), but won't help with HMR on its own
        ctx.server.moduleGraph.invalidateModule(mod, undefined, timestamp)
      }

      // Surely, this is not the best way to fix that, especially given direct `send` call bypassing all Vite logic.
      // But just returning extra modules does not cause Vite to send the update, and I didn't find a way to trigger
      // that update manually other than sending it directly

      ctx.server.ws.send({
        type: 'update',
        updates: Array.from(extraModules).map((mod) => {
          return {
            type: mod.type === 'js' ? 'js-update' : 'css-update',
            path: mod.url,
            acceptedPath: mod.url,
            timestamp
          }
        })
      })
      if (ctx.file.includes('/content-cache/')) {
        // @ts-ignore
        return true
      }
    }
  }
}
