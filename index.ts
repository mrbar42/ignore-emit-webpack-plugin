'use strict';

import {version, Compilation, Compiler} from 'webpack';

class IgnoreEmitPlugin {
  private readonly options: { debug?: boolean };
  private readonly DEBUG: boolean;
  private readonly ignorePatterns: RegExp[];

  constructor(ignoreRegex: RegExp | string | Array<RegExp | string> = [], options: { debug?: boolean; } = {}) {
    if (!ignoreRegex || Array.isArray(ignoreRegex) && !ignoreRegex.length) {
      throw new Error(`IgnoreEmitPlugin: Must include patterns to ignore`);
    }

    this.options = options;
    this.DEBUG = !!this.options.debug;
    this.ignorePatterns = this.normalizeRegex(ignoreRegex);
  }

  private normalizeRegex(regex: RegExp | string | Array<RegExp | string>): RegExp[] {
    if (regex instanceof RegExp) {
      return [regex];
    } else if (Array.isArray(regex)) {
      const normalizedList = [];
      for (const input of regex) {
        normalizedList.push(...this.normalizeRegex(input));
      }
      return normalizedList;
    } else if (typeof regex === 'string') {
      // escape special chars and create a regex instance
      return [new RegExp(regex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))];
    }

    throw new Error('IgnoreEmitPlugin: invalid ignore pattern - must be {RegExp|string|Array<RegExp|string>');
  }

  private checkIgnore(assetName: string, ignorePatterns: RegExp[]): boolean {
    return ignorePatterns.some(pattern => {
      if (Array.isArray(pattern)) {
        return this.checkIgnore(assetName, pattern);
      }

      return pattern.test(assetName);
    });
  }

  public apply(compiler: Compiler) {
    const ignoreAssets = (compilation: Compilation) => {
      Object.keys(compilation.assets).forEach(assetName => {
        if (this.checkIgnore(assetName, this.ignorePatterns)) {
          this.DEBUG && console.log(`IgnoreEmitPlugin: Ignoring asset ${assetName}`);
          if (typeof compilation.deleteAsset === 'function') {
            // Webpack 5
            compilation.deleteAsset(assetName);
          } else {
            // older versions
            delete compilation.assets[assetName];
          }
        }
      });
    };

    // webpack 5
    if (compiler.hooks && compiler.hooks.compilation && version && Number(version[0]) > 4) {
      this.DEBUG && console.log('Using Webpack5 format');
      compiler.hooks.compilation.tap(
        'IgnoreEmitPlugin',
        (compilation: Compilation) => {
          if (compilation.hooks.processAssets) {
            compilation.hooks.processAssets.tap(
              {
                name: 'IgnoreEmitPlugin',
                stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
              },
              () => {
                ignoreAssets(compilation);
              }
            );
          } else {
            compilation.hooks.additionalAssets.tap('IgnoreEmitPlugin',
              () => ignoreAssets(compilation)
            );
          }
        }
      );
    }
    // webpack 4
    else if (compiler.hooks && compiler.hooks.emit) {
      this.DEBUG && console.log('Using Webpack4 format');
      compiler.hooks.emit.tap('IgnoreEmitPlugin', ignoreAssets);
    }
    // webpack 3
    else {
      this.DEBUG && console.log('Using Webpack3 or older format');
      // @ts-ignore - this signature does not exist on the latest webpack typing
      compiler.plugin('emit', (compilation, callback) => {
        ignoreAssets(compilation);
        callback();
      });
    }
  }
}

export {IgnoreEmitPlugin};
export default IgnoreEmitPlugin;

// support plain node require
module.exports = IgnoreEmitPlugin;
module.exports.default = IgnoreEmitPlugin;
module.exports.IgnoreEmitPlugin = IgnoreEmitPlugin;
