/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/en/configuration.html
 */

module.exports = {
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageProvider: 'babel',
  coverageReporters: ['text', 'html'],
  errorOnDeprecated: true,
  roots: ['src'],
};
