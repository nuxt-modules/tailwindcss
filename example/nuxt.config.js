import tailwindModule from '../src'

export default {
  buildModules: [
    tailwindModule
  ],

  components: true,

  tailwindcss: {
    mode: 'jit',
    exposeConfig: true
  }
}
