'use strict';

const IgnoreEmitPlugin = require('../');

expect(typeof IgnoreEmitPlugin === 'function', 'Expected main export to be a function');
expect(typeof IgnoreEmitPlugin.IgnoreEmitPlugin === 'function', 'Expected IgnoreEmitPlugin named export');
expect(typeof IgnoreEmitPlugin.default === 'function', 'Expected default export');
expect(
  IgnoreEmitPlugin === IgnoreEmitPlugin.IgnoreEmitPlugin && IgnoreEmitPlugin === IgnoreEmitPlugin.default,
  'Expected all exports to be identical'
);

function expect(condition, message) {
  if (!condition) throw new Error(message);
}
