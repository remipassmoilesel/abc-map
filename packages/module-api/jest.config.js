/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  testEnvironment: 'jsdom',
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageProvider: 'babel',
  coverageReporters: ['text', 'html'],
  errorOnDeprecated: true,
  roots: ['src'],
  moduleNameMapper: {
    '\\.css$': '<rootDir>/src/__mocks__/style.js',
    '\\.scss$': '<rootDir>/src/__mocks__/style.js'
  },
};
