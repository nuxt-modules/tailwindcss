import { isAbsolute, resolve } from 'path'
import { HmrContext, Plugin } from 'vite'
import minimatch from 'minimatch'

export default function (tailwindConfig: any = {}, rootDir: string, cssPath: string): Plugin {
  const resolvedContent: string[] = (tailwindConfig.content || []).map(f => !isAbsolute(f) ? resolve(rootDir, f) : f)

  return {
    name: 'nuxt:tailwindcss',
    handleHotUpdate (ctx: HmrContext): void {
      if (resolvedContent.findIndex(c => minimatch(ctx.file, c)) === -1) {
        return
      }

      const extraModules = ctx.server.moduleGraph.getModulesByFile(cssPath)
      const timestamp = +Date.now()

      for (const mod of extraModules) {
        // This will invalidate Vite cache (e.g. next page reload will be fine), but won't help with HMR on its own
        ctx.server.moduleGraph.invalidateModule(mod, undefined, timestamp)
        // for (const importedModule of mod.importedModules) {
        //   console.log(importedModule.id)
        // }
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
};
