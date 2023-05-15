import { findPath } from "@nuxt/kit"
import type { Arrayable, InjectPosition } from "./types"

/**
 * Resolves all configPath values for an application
 *
 * @param path configPath for a layer
 * @returns array of resolved paths
 */
export const resolveConfigPath = async (path: Arrayable<string>) => (
  await Promise.all(
    (Array.isArray(path) ? path : [path])
      .filter(Boolean)
      .map((path) => findPath(path, { extensions: ['.js', '.cjs', '.mjs', '.ts'] }))
  )
).filter((i): i is string => Boolean(i))

/**
 *
 * @param srcDir
 * @returns array of resolved content globs
 */
export const resolveContentPaths = (srcDir: string) => ([
  `${srcDir}/components/**/*.{vue,js,ts}`,
  `${srcDir}/layouts/**/*.vue`,
  `${srcDir}/pages/**/*.vue`,
  `${srcDir}/composables/**/*.{js,ts}`,
  `${srcDir}/plugins/**/*.{js,ts}`,
  `${srcDir}/utils/**/*.{js,ts}`,
  `${srcDir}/App.{js,ts,vue}`,
  `${srcDir}/app.{js,ts,vue}`,
  `${srcDir}/Error.{js,ts,vue}`,
  `${srcDir}/error.{js,ts,vue}`,
  `${srcDir}/app.config.{js,ts}`
])

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
