export { LogLevels } from 'consola'
import { useLogger } from '@nuxt/kit'

export default useLogger('nuxt:tailwindcss') as import('consola').ConsolaInstance
