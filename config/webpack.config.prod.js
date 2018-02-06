const _ = require('lodash');
const paths = require('./paths');
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

baseConfig.output = {
    path: paths.GUI_BUILD_ROOT,
    publicPath: paths.PUBLIC_PATH,
    filename: paths.JS_BUILD_NAME
};

module.exports = baseConfig;