const {override, addWebpackModuleRule} = require('customize-cra');

module.exports = {
  webpack: function (config) {
    config = override(
      // We inline SVG files suffixed with '.inline.svg'
      addWebpackModuleRule({
        test: /\.inline\.svg$/,
        use: 'svg-inline-loader',
      })
    )(config);

    // We disable eslint and typescript check for a better DX as they are very slow.
    // Lint and typecheck pass only in CI. See package.json for eslint and tsc commands.
    const excluded = ['ESLintWebpackPlugin', 'ForkTsCheckerWebpackPlugin'];
    config.plugins = config.plugins.filter(p => !excluded.includes(p.constructor.name));

    return config;
  },
  jest: function (config) {
    // React app rewired merge 'transformIgnorePatterns' field with automagical stuff that break Openlayers support in tests, so we replace it
    // See: https://github.com/timarney/react-app-rewired/issues/241
    config.transformIgnorePatterns = ['node_modules/(?!(ol)/)'];
    config.moduleNameMapper = {'\\.css$': '<rootDir>/src/assets/styles/mocks/style.js'};
    config.coverageReporters = ['text', 'html'];
    config.transform = {
      '\\.inline\\.svg$': '<rootDir>/scripts/inline-svg-transformer.js',
      ...config.transform,
    };
    config.setupFiles = ['<rootDir>/scripts/test-setup.js']
    return config;
  },
};
