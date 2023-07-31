const { InjectManifest } = require('workbox-webpack-plugin');
const path = require('path');

module.exports = {
  webpack: {
    configure: function (config, { env }) {
      // We inline SVG files suffixed with '.inline.svg'
      addWebpackModuleRule(config, {
        test: /\.inline\.svg$/,
        type: 'asset/source',
      });

      // We disable eslint and typescript check for a better DX as they are very slow.
      // Lint and typecheck pass only in CI. See package.json for eslint and tsc commands.
      const excluded = ['ESLintWebpackPlugin', 'ForkTsCheckerWebpackPlugin'];
      config.plugins = config.plugins.filter((p) => !excluded.includes(p.constructor.name));

      // Polyfills
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
      };

      // Ignore source map warnings
      config.ignoreWarnings = (config.ignoreWarnings || []).concat([/Failed to parse source map/]);

      // We remove the ability to load SVGs as React Component as it is useless and all SVG contains namespaces
      const uselessSvgRule = config.module.rules[1].oneOf[3].use[0];
      if (!uselessSvgRule.loader.includes('@svgr')) {
        throw new Error("Webpack configuration changed, update 'craco.config.js' file");
      }
      config.module.rules[1].oneOf[3].use = config.module.rules[1].oneOf[3].use.filter((r) => r !== uselessSvgRule);

      // Service worker config for development
      if (env === 'development') {
        config.plugins.push(
          new InjectManifest({
            swSrc: path.resolve(__dirname, 'src/service-worker.ts'),
            dontCacheBustURLsMatching: /\.[0-9a-f]{8}\./,
            exclude: [/\.map$/, /asset-manifest\.json$/, /LICENSE/],
            maximumFileSizeToCacheInBytes: 30 * 1024 * 1024,
          })
        );
      }

      return config;
    },
  },
  devServer: function (config) {
    // CRA setups a fake service worker on development
    // We erase fake service worker setup
    config.onBeforeSetupMiddleware = undefined;
    config.onAfterSetupMiddleware = undefined;

    // We set up development proxy
    const defaultProxyConfig = {
      target: 'http://localhost:10082',
      logLevel: 'silent',
      secure: false,
      changeOrigin: true,
      ws: true,
      xfwd: true,
    };
    config.proxy = {
      '/api': defaultProxyConfig,
      '/documentation/': defaultProxyConfig,
      '/legal-mentions.html': defaultProxyConfig,
    };

    return config;
  },
  jest: {
    configure: function (config) {
      // Add a module here if you want to use modern js syntax
      // We do not keep default config because it breaks Openlayers support in tests, see: https://github.com/timarney/react-app-rewired/issues/241
      config.transformIgnorePatterns = [];
      config.testEnvironment = 'jsdom';
      config.moduleNameMapper = {
        '\\.css$': '<rootDir>/src/styles/mocks/style.js',
        '\\.scss$': '<rootDir>/src/styles/mocks/style.js',
      };
      config.coverageReporters = ['text', 'html'];
      config.transform = {
        '\\.inline\\.svg$': '<rootDir>/scripts/inline-svg-transformer.js',
        ...config.transform,
      };
      config.setupFiles = ['<rootDir>/scripts/test-setup.js'];
      // This option is needed in order to prevent weird errors in low ressources environment
      config.maxWorkers = '25%';
      return config;
    },
  },
};

function addWebpackModuleRule(config, rule) {
  for (let _rule of config.module.rules) {
    if (_rule.oneOf) {
      _rule.oneOf.unshift(rule);
      break;
    }
  }
}
