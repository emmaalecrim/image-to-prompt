/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require('webpack-merge');

const commonConfig = require('./webpack.common');

module.exports = (envVars) => {
  const { env } = envVars;

  // eslint-disable-next-line import/no-dynamic-require, global-require
  const envConfig = require(`./webpack.${env}.js`);
  const config = merge(commonConfig, envConfig);
  return config;
};
