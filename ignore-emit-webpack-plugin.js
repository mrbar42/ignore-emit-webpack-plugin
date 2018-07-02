'use strict';

class IgnoreEmitPlugin {
  constructor(ignoreRegex = [], options = {}) {
    if (!ignoreRegex || Array.isArray(ignoreRegex) && !ignoreRegex.length) {
      throw new Error(`IgnoreEmitPlugin: Must include patterns to ignore`);
    }

    this.options = options;
    this.DEBUG = !!this.options.debug;
    this.ignorePatterns = this.normalizeRegex(ignoreRegex);
  }

  normalizeRegex(regex) {
    if (regex instanceof RegExp) {
      return [regex];
    }
    else if (Array.isArray(regex)) {
      return regex.map(this.normalizeRegex, this);
    }
    else if (typeof regex === 'string') {
      // escape special chars and create a regex instance
      return [new RegExp(regex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))];
    }

    throw new Error('IgnoreEmitPlugin: invalid ignore pattern - must be {RegExp|string|Array.<RegExp|string>');
  }

  checkIgnore(assetName, ignorePatterns) {
    return ignorePatterns.some(pattern => {
      if (Array.isArray(pattern)) {
        return this.checkIgnore(assetName, pattern);
      }

      return pattern.test(assetName);
    });
  }

  apply(compiler) {
    const ignoreAssets = compilation => {
      Object.keys(compilation.assets).forEach(assetName => {
        if (this.checkIgnore(assetName, this.ignorePatterns)) {
          this.DEBUG && console.log(`IgnoreEmitPlugin: Ignoring asset ${assetName}`);
          delete compilation.assets[assetName];
        }
      });
    };

    // webpack 4
    if (compiler.hooks && compiler.hooks.emit) {
      compiler.hooks.emit.tap('IgnoreEmitPlugin', ignoreAssets);
    }
    // webpack 3
    else {
      compiler.plugin('emit', (compilation, callback) => {
        ignoreAssets(compilation);
        callback();
      });
    }
  }
}

module.exports = IgnoreEmitPlugin;
