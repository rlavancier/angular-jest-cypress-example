const { defaults } = require('jest-config');

module.exports = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "src/app/**/*.ts",
    "!src/app/**/*.module.ts"
  ],
  testPathIgnorePatterns: [
    "cypress"
  ],

  moduleDirectories: ['node_modules', 'src']
}