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
    library: 'documentation',
    libraryTarget: 'umd',
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
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/inline',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts'],
  },
  watchOptions: {
    ignored: /node_modules/,
  },
};
