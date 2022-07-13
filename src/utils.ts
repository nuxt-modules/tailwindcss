export type InjectPosition = 'first' | 'last' | number | { after: string };

/** Resolve human-readable inject position specification into absolute index in the array */
export function resolveInjectPosition (css: string[], position: InjectPosition): number {
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
