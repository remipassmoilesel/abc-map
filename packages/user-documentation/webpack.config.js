const path = require('path');
const marked = require('marked');
const renderer = new marked.Renderer();

module.exports = {
  mode: 'production',
  entry: './src/index.ts',
  stats: 'errors-warnings',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index.js',
    // Absolute public path is needed for ressources
    publicPath: '/',
    assetModuleFilename: 'static/documentation-assets/[name]-[hash][ext][query]',
    library: {
      name: 'documentation',
      type: 'umd',
    },
  },
  module: {
    rules: [
      {
        test: /\.md$/,
        use: [
          {
            loader: 'html-loader',
          },
          {
            loader: 'markdown-loader',
            options: {
              renderer,
            },
          },
        ],
      },
      {
        test: /\.(png|jpe?g|gif|mp4)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  watchOptions: {
    ignored: /node_modules/,
  },
};
