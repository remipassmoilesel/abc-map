import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

export default {
  mode: 'production',
  context: path.join(import.meta.dirname, 'src'),
  target: 'web',
  externals: /^k6(\/.*)?/,
  stats: 'errors-warnings',
  entry: {
    index: './index.ts',
  },
  output: {
    path: path.join(import.meta.dirname, 'build'),
    libraryTarget: 'commonjs',
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [new CleanWebpackPlugin()],
  watchOptions: {
    ignored: /build/,
  },
};
