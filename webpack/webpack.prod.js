/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  cache: false,
  devtool: false,
  plugins: [
    new webpack.DefinePlugin({
      'process.env.REACT_APP_ENVIRONMENT': JSON.stringify('PROD'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
          },
        ],
      },
    ],
  },
};
