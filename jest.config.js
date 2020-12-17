module.exports = {
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    'lib/**/*.js',
    '!lib/templates/**',
    '!lib/serverMiddleware/tailwindConfigViewer.js'
  ],
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/lib/$1',
    '^~~$': '<rootDir>',
    '^@@$': '<rootDir>',
    '^@/(.*)$': '<rootDir>/lib/$1'
  },
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
}
