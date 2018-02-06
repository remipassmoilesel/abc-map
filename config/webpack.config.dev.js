const _ = require('lodash');
const paths = require('./paths');
const webpack = require('webpack');
const baseConfig = _.cloneDeep(require('./webpack.config.base'));

baseConfig.devServer = {
    contentBase: paths.GUI_SOURCE_ROOT,
    host: '127.0.0.1',
    port: 9090,
    stats: {
        colors: true
    }
};

module.exports = baseConfig;