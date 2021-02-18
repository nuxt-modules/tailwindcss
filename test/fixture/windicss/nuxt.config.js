import { join } from 'path'
import tailwindModule from '../../../lib/module'

export default {
  buildModules: [
    tailwindModule
  ],
  tailwindcss: {
    windicss: true,
    windicssOptions: {
      config: join(__dirname, 'tailwind.config.js')
    }
  },
  components: true
}
