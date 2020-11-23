'use strict';

const webpack = require('webpack');
const IgnoreEmitPlugin = require('../');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  bail: true,
  mode: 'production',
  entry: {
    app: './test/app.js'
  },
  output: {
    publicPath: '',
    chunkFilename: `[name].js`,
    path: __dirname + '/tmp'
  },
  plugins: [
    new IgnoreEmitPlugin(/chunk\.js$/, {debug: true}),
    new webpack.SourceMapDevToolPlugin()
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
};
