# Ignore Emit Webpack plugin

[![Build Status](https://travis-ci.org/mrbar42/ignore-emit-webpack-plugin.svg?branch=master)](https://travis-ci.org/mrbar42/ignore-emit-webpack-plugin)

Prevent files that are matching a pattern from being emitted in a webpack build.
This is achieved with a webpack plugin.

Even though it was tested with webpack 3 and works great,
you can easily ignore file by accident - use with care.

## Quick Usage

```sh
npm i --save-dev ignore-emit-webpack-plugin

```

```js
// webpack.config.js
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');

module.exports = {
  // ...
  plugins: [ new IgnoreEmitPlugin(/\.map$/) ]
  // ...
};

```

The module is written in Node 8.x flavored es6.
To get the es5 transpiled version use `require('ignore-emit-webpack-plugin/es5')`

## Usage

Signature: `new IgnoreEmitPlugin(patterns, options)`


- **patterns** `{RegExp|string|Array.<RegExp|string>}` - regex, string or array with mixed regex/strings (deep nesting allowed),
to match against the **OUTPUT** path of assets.

not defining patterns or defining invalid pattern will throw error.

```js
// single regex
new IgnoreEmitPlugin(/\/artifacy.js$/);
// single regex in array
new IgnoreEmitPlugin([/\/artifacy.js$/]);
// mixed array
new IgnoreEmitPlugin(['file.woff', /\/artifacy.js$/]);

// you can also do this - but DONT
new IgnoreEmitPlugin([[[[/\/artifacy.js$/]]]]);


// file.js
// dir/file.js

new IgnoreEmitPlugin('file.js');     // both file.js and dir/file.js ignored
new IgnoreEmitPlugin(/\/file\.js/);  // only dir/file.js is ignored
new IgnoreEmitPlugin(/^file\.js/);   // only file.js is ignored
```


- **options** `{object}` - optional, options object
- options.debug `{boolean}` - prints extra logs

## I want to help!

Contribution would be much appreciated.
Either by creating pull requests of opening issues.
