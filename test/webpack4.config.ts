'use strict';

const IgnoreEmitPlugin = require('../');

module.exports = {
  bail: true,
  entry: {
    app: './app.js'
  },
  output: {
    filename: '[name].js',
    publicPath: '',
    chunkFilename: `[name].js`,
    path: __dirname + '/tmp'
  },
  plugins: [new IgnoreEmitPlugin(/chunk\.js$/)]
};
