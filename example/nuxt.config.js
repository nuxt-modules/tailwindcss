import tailwindModule from '..'

export default {
  buildModules: [
    tailwindModule
  ],
  components: true,
  tailwindcss: {
    jit: true,
    exposeConfig: true
  }
}
