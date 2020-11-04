'use strict';

const IgnoreEmitPlugin = require('../');

module.exports = {
  bail: true,
  mode: 'production',
  entry: {
    app: './test/app.js'
  },
  output: {
    filename: '[name].js',
    publicPath: '',
    chunkFilename: `[name].js`,
    path: __dirname + '/tmp'
  },
  plugins: [new IgnoreEmitPlugin(/chunk\.js$/)]
};
