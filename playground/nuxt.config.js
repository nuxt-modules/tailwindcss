import tailwindModule from '../src/module'

export default {
  components: true,
  buildModules: [
    tailwindModule
  ],
  tailwindcss: {
    exposeConfig: true
  }
}
