/**
 * This file 'simulate' webpack svg inlining.
 */
module.exports = {
  getCacheKey(sourceText, sourcePath, options) {
    return sourcePath;
  },

  process(src, filename, config, options) {
    return `module.exports = ${JSON.stringify(src)};`;
  },
};
