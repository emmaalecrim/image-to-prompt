/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  mode: 'development',
  cache: true,
  devServer: {
    hot: true,
    port: 3000,
    open: true,
  },
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [['@babel/preset-env', { targets: 'defaults' }]],
              plugins: ['@babel/plugin-transform-runtime'],
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.REACT_APP_ENVIRONMENT': JSON.stringify('DEV'),
    }),
    new ReactRefreshWebpackPlugin(),
  ],
};
