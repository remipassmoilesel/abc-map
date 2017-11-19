const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

const sourceRoot = path.resolve('./src/gui/');
const distRoot = path.resolve('./dist/');
const buildDestinationRoot = path.join(distRoot, 'gui');
const mainTsPath = path.join(sourceRoot, 'main.ts');

const nodeModulesRoot = path.resolve('./node_modules');

module.exports = {
    entry: mainTsPath,
    output: {
        path: buildDestinationRoot,
        publicPath: path.join(__dirname, '..', '/dist/gui/'),
        filename: 'build.js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                        // the "scss" and "sass" values for the lang attribute to the right configs here.
                        // other preprocessors should work out of the box, no loader config like this necessary.
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
                    }
                    // other vue-loader options go here
                }
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: {
                    appendTsSuffixTo: [/\.vue$/],
                }
            },
            {
                test: /\.(htm|html)$/,
                loader: 'html-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map',
    target: 'electron-renderer',
    node: {     // disable mocking of these values by webpack
        __dirname: false,
        __filename: false
    },
    plugins: [
        new ExtractTextPlugin({ // define where to save the file
            filename: '[name].bundle.css',
            allChunks: true
        }),

        // Workaround for devtron in webpack
        new CopyWebpackPlugin([
            {
                from: path.resolve(sourceRoot, 'index.html'),
                to: buildDestinationRoot
            },
            {
                from: path.resolve(nodeModulesRoot, 'devtron/manifest.json'),
                to: buildDestinationRoot
            },
            {
                from: path.resolve(nodeModulesRoot, 'devtron/out/browser-globals.js'),
                to: path.join(buildDestinationRoot, 'out')
            }
        ])
    ]
};

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
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
}
