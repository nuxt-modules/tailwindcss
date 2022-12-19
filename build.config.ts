import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  externals: [
    'pathe',
    'minimatch'
  ],
  failOnWarn: false
})
