import tailwindModule from '../src'

export default {
  buildModules: [
    tailwindModule
  ],
  components: true,
  tailwindcss: {
    exposeConfig: true
  }
}
