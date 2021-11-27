const { override, addWebpackModuleRule } = require('customize-cra');

module.exports = {
  webpack: override(
    // We inline SVG files suffixed with '.inline.svg'
    addWebpackModuleRule({
      test: /\.inline\.svg$/,
      use: 'svg-inline-loader',
    })
  ),
  jest: function (config) {
    // React app rewired merge 'transformIgnorePatterns' field with automagical stuff that break Openlayers support in tests, so we replace it
    // See: https://github.com/timarney/react-app-rewired/issues/241
    config.transformIgnorePatterns = ['node_modules/(?!(ol)/)'];
    config.moduleNameMapper = { '\\.css$': '<rootDir>/src/assets/styles/mocks/style.js' };
    config.coverageReporters = ['text', 'html'];
    config.transform = {
      '\\.inline\\.svg$': '<rootDir>/scripts/inline-svg-transformer.js',
      ...config.transform,
    };
    config.setupFiles = ['<rootDir>/scripts/test-setup.js']
    return config;
  },
};
