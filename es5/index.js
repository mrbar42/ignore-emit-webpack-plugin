'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IgnoreEmitPlugin = function () {
  function IgnoreEmitPlugin() {
    var ignoreRegex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, IgnoreEmitPlugin);

    if (!ignoreRegex || Array.isArray(ignoreRegex) && !ignoreRegex.length) {
      throw new Error('IgnoreEmitPlugin: Must include patterns to ignore');
    }

    this.options = options;
    this.DEBUG = !!this.options.debug;
    this.ignorePatterns = this.normalizeRegex(ignoreRegex);
  }

  _createClass(IgnoreEmitPlugin, [{
    key: 'normalizeRegex',
    value: function normalizeRegex(regex) {
      if (regex instanceof RegExp) {
        return [regex];
      } else if (Array.isArray(regex)) {
        return regex.map(this.normalizeRegex, this);
      } else if (typeof regex === 'string') {
        // escape special chars and create a regex instance
        return [new RegExp(regex.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))];
      }

      throw new Error('IgnoreEmitPlugin: invalid ignore pattern - must be {RegExp|string|Array.<RegExp|string>');
    }
  }, {
    key: 'checkIgnore',
    value: function checkIgnore(assetName, ignorePatterns) {
      var _this = this;

      return ignorePatterns.some(function (pattern) {
        if (Array.isArray(pattern)) {
          return _this.checkIgnore(assetName, pattern);
        }

        return pattern.test(assetName);
      });
    }
  }, {
    key: 'apply',
    value: function apply(compiler) {
      var _this2 = this;

      compiler.hooks.emit.tap('IgnoreEmitPlugin', function (compilation) {
        Object.keys(compilation.assets).forEach(function (assetName) {
          if (_this2.checkIgnore(assetName, _this2.ignorePatterns)) {
            _this2.DEBUG && console.log('IgnoreEmitPlugin: Ignoring asset ' + assetName);
            delete compilation.assets[assetName];
          }
        });
      });
    }
  }]);

  return IgnoreEmitPlugin;
}();

module.exports = IgnoreEmitPlugin;
