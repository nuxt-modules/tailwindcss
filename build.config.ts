import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  externals: [
    'pathe'
  ],
  failOnWarn: false
})
