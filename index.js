'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
exports.IgnoreEmitPlugin = void 0;
var webpack_1 = require("webpack");
var IgnoreEmitPlugin = /** @class */ (function () {
    function IgnoreEmitPlugin(ignoreRegex, options) {
        if (ignoreRegex === void 0) { ignoreRegex = []; }
        if (options === void 0) { options = {}; }
        if (!ignoreRegex || Array.isArray(ignoreRegex) && !ignoreRegex.length) {
            throw new Error("IgnoreEmitPlugin: Must include patterns to ignore");
        }
        this.options = options;
        this.DEBUG = !!this.options.debug;
        this.ignorePatterns = this.normalizeRegex(ignoreRegex);
    }
    IgnoreEmitPlugin.prototype.normalizeRegex = function (regex) {
        if (regex instanceof RegExp) {
            return [regex];
        }
        else if (Array.isArray(regex)) {
            var normalizedList = [];
            for (var _i = 0, regex_1 = regex; _i < regex_1.length; _i++) {
                var input = regex_1[_i];
                normalizedList.push.apply(normalizedList, this.normalizeRegex(input));
            }
            return normalizedList;
        }
        else if (typeof regex === 'string') {
            // escape special chars and create a regex instance
            return [new RegExp(regex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))];
        }
        throw new Error('IgnoreEmitPlugin: invalid ignore pattern - must be {RegExp|string|Array<RegExp|string>');
    };
    IgnoreEmitPlugin.prototype.checkIgnore = function (assetName, ignorePatterns) {
        var _this = this;
        return ignorePatterns.some(function (pattern) {
            if (Array.isArray(pattern)) {
                return _this.checkIgnore(assetName, pattern);
            }
            return pattern.test(assetName);
        });
    };
    IgnoreEmitPlugin.prototype.apply = function (compiler) {
        var _this = this;
        var ignoreAssets = function (compilation) {
            Object.keys(compilation.assets).forEach(function (assetName) {
                if (_this.checkIgnore(assetName, _this.ignorePatterns)) {
                    _this.DEBUG && console.log("IgnoreEmitPlugin: Ignoring asset " + assetName);
                    if (typeof compilation.deleteAsset === 'function') {
                        // Webpack 5
                        compilation.deleteAsset(assetName);
                    }
                    else {
                        // older versions
                        delete compilation.assets[assetName];
                    }
                }
            });
        };
        // webpack 5
        if (compiler.hooks && compiler.hooks.compilation && webpack_1.version && Number(webpack_1.version[0]) > 4) {
            this.DEBUG && console.log('Using Webpack5 format');
            compiler.hooks.compilation.tap('IgnoreEmitPlugin', function (compilation) {
                if (compilation.hooks.processAssets) {
                    compilation.hooks.processAssets.tap({
                        name: 'IgnoreEmitPlugin',
                        stage: webpack_1.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS
                    }, function () {
                        ignoreAssets(compilation);
                    });
                }
                else {
                    compilation.hooks.additionalAssets.tap('IgnoreEmitPlugin', function () { return ignoreAssets(compilation); });
                }
            });
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
            compiler.plugin('emit', function (compilation, callback) {
                ignoreAssets(compilation);
                callback();
            });
        }
    };
    return IgnoreEmitPlugin;
}());
exports.IgnoreEmitPlugin = IgnoreEmitPlugin;
exports.default = IgnoreEmitPlugin;
// support plain node require
module.exports = IgnoreEmitPlugin;
module.exports.default = IgnoreEmitPlugin;
module.exports.IgnoreEmitPlugin = IgnoreEmitPlugin;
//# sourceMappingURL=index.js.map