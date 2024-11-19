import { defu } from 'defu'
import { getContext } from 'unctx'
import type { TWConfig } from '../types'

type Context = {
  config: Partial<TWConfig>
  dst: string
  meta: {
    disableHMR?: boolean
  }
}

const twCtx = getContext<Partial<Context>>('twcss')
const { set } = twCtx

twCtx.set = (instance, replace = true) => {
  set(defu(instance, twCtx.tryUse()), replace)
}

export { twCtx }
