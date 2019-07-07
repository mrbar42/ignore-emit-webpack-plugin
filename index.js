'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
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