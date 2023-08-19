/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: path.resolve(__dirname, '..', './src/index.tsx'),
  module: {
    exclude: path.resolve(__dirname, '..', './src/api'),
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|tff|otf|)$/,
        type: 'asset/inline',
      },
      {
        test: /\.svg$/i,
        type: 'asset/inline',
        resourceQuery: /url/, // *.svg?url
      },

      {
        test: /\.svg$/i,
        resourceQuery: { not: [/url/] },
        issuer: /\.[jt]sx?$/,

        use: [
          {
            loader: '@svgr/webpack',
            options: {
              exportType: 'named',
              svgo: false,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, '..', './src'),
      '@presentation': path.resolve(__dirname, '..', './src/presentation'),
      '@components': path.resolve(
        __dirname,
        '..',
        './src/presentation/components'
      ),
      '@assets': path.resolve(__dirname, '..', './src/presentation/assets'),
      '@sass': path.resolve(__dirname, '..', './src/presentation/assets/sass'),
      '@images': path.resolve(
        __dirname,
        '..',
        './src/presentation/assets/images'
      ),
    },
    modules: ['node_modules'],
    extensions: ['.tsx', '.ts', '.jsx', '.js', '...'],
    fallback: {
      fs: false,
      path: false,
    },
  },
  output: {
    path: path.resolve(__dirname, '..', './build'),
    filename: 'bundle.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '..', './public/index.html'),
    }),

    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],

  performance: {
    maxAssetSize: 10000000,
  },
  stats: 'errors-only',
};
