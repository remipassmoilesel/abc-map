const _ = require('lodash');
const webpack = require('webpack');
const baseConfig = _.cloneDeep(require('./webpack.config.base'));

baseConfig.devtool = '#source-map';

// http://vue-loader.vuejs.org/en/workflow/production.html
baseConfig.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: '"production"'
        }
    }),
    new webpack.optimize.UglifyJsPlugin({
        sourceMap: true,
        compress: {
            warnings: false
        }
    }),
    new webpack.LoaderOptionsPlugin({
        minimize: true
    })
]);

module.exports = baseConfig;