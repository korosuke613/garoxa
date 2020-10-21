import * as Webpack from 'webpack';
import {resolve} from 'path';
/** ビルド結果出力先 */
const BUILT_PATH = resolve(__dirname, './build');
/** ビルド種別 */
const BUILD_VARIANT = process.env.NODE_ENV;


const config: Webpack.Configuration = {
  target: 'node',
  mode: BUILD_VARIANT === 'production' ? 'production' : 'development',
  resolve: {
    extensions: ['.ts', '.js']
  },
  devtool: 'source-map',
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    path: BUILT_PATH,
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader'
      }
    ]
  }
};

export default config;