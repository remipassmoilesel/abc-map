const {override, addWebpackModuleRule} = require('customize-cra');
const {InjectManifest} = require('workbox-webpack-plugin');
const path = require('path');

module.exports = {
  webpack: function (config, env) {
    config = override(
      // We inline SVG files suffixed with '.inline.svg'
      addWebpackModuleRule({
        test: /\.inline\.svg$/,
        type: 'asset/source',
      })
    )(config);

    // We disable eslint and typescript check for a better DX as they are very slow.
    // Lint and typecheck pass only in CI. See package.json for eslint and tsc commands.
    const excluded = ['ESLintWebpackPlugin', 'ForkTsCheckerWebpackPlugin'];
    config.plugins = config.plugins.filter(p => !excluded.includes(p.constructor.name));

    // Polyfills
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve("stream-browserify")
    }

    // Ignore source map warnings
    config.ignoreWarnings = (config.ignoreWarnings || []).concat([/Failed to parse source map/]);

    // We remove the ability to load SVGs as React Component as it is useless and all SVG contains namespaces
    const uselessSvgRule = config.module.rules[1].oneOf[3].use[0];
    if (!uselessSvgRule.loader.includes('@svgr')) {
      throw new Error("Webpack configuration changed, update 'config-overrides.js' file");
    }
    config.module.rules[1].oneOf[3].use = config.module.rules[1].oneOf[3].use.filter(r => r !== uselessSvgRule);

    // Service worker config for development
    if (env === 'development')
      config.plugins.push(new InjectManifest({
        swSrc: path.resolve(__dirname, 'src/service-worker.ts'),
        dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
        exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
      }));

    return config;
  },
  devServer: function (configFunction) {
    return function (proxy, allowedHost) {
      // Create the default config by calling configFunction with the proxy/allowedHost parameters
      const config = configFunction(proxy, allowedHost);
      // CRA setup a fake service worker on development
      // We erase fake service worker seup
      config.onAfterSetupMiddleware = undefined;
      return config;
    }
  },
  jest: function (config) {
    // React app rewired merge 'transformIgnorePatterns' field with automagical stuff that break Openlayers support in tests, so we replace it
    // See: https://github.com/timarney/react-app-rewired/issues/241
    config.transformIgnorePatterns = ['node_modules/(?!(ol|geotiff)/)'];
    config.moduleNameMapper = {
      '\\.css$': '<rootDir>/src/styles/mocks/style.js',
      '\\.scss$': '<rootDir>/src/styles/mocks/style.js'
    };
    config.coverageReporters = ['text', 'html'];
    config.transform = {
      '\\.inline\\.svg$': '<rootDir>/scripts/inline-svg-transformer.js',
      ...config.transform,
    };
    config.setupFiles = ['<rootDir>/scripts/test-setup.js'];
    // This option is needed in order to prevent weird errors in low ressources environment
    config.maxWorkers = '50%';
    return config;
  },
};
