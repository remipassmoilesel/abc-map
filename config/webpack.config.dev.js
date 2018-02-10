const _ = require('lodash');
const path = require('path');
const paths = require('./paths');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const baseConfig = _.cloneDeep(require('./webpack.config.base'));

baseConfig.devServer = {
    host: '127.0.0.1',
    port: 9090,
    stats: {
        colors: true
    },
    contentBase: paths.PUBLIC_DIR,
    publicPath: 'http://localhost:9090/'
};

baseConfig.output = {
    filename: paths.JS_BUILD_NAME,
    publicPath: 'http://localhost:9090/'
};

const projectRoot = path.resolve(__dirname, '..');

// Workaround for devtron, not functionnal naymore
// baseConfig.plugins.push(
//     // Workaround for devtron in webpack
//     new CopyWebpackPlugin([
//         {
//             from: path.resolve(paths.NODE_MODULES_ROOT, 'devtron/manifest.json'),
//             to: paths.GUI_BUILD_ROOT
//         },
//         {
//             from: path.resolve(paths.NODE_MODULES_ROOT, 'devtron/out/browser-globals.js'),
//             to: path.join(paths.GUI_BUILD_ROOT, 'out')
//         }
//     ])
// );

module.exports = baseConfig;