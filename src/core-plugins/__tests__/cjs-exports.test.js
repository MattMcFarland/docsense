const testFactory = require('./utils/testFactory')
const cjsExportsPlugin = require('../cjs-exports')
const defaultExports = [
  'module.exports = function () {}',
  'exports = function () {}',
  'module.exports = foo()',
  'exports = foo()',
  'module.exports = new Foo()',
  'exports = new Foo()',
  'module.exports = new a.b.c.Foo()',
  'exports = new a.b.c.Foo()',
  'module.exports = []',
  'exports = []',
  'module.exports = () => {}',
  'exports = () => {}',
  'module.exports = fn.call()',
  'exports = fn.call()',
  'module.exports = fn.apply()',
  'exports = fn.apply()',
  '(function () { module.exports = foo })()',
]
const namedExports = [
  'module.exports.name = function () {}',
  'exports.name = function () {}',
  'module.exports.name = foo()',
  'exports.name = foo()',
  'module.exports.name = []',
  'exports.name = []',
  'module.exports.name = () => {}',
  'exports.name = () => {}',
  'module.exports.name = fn.call()',
  'exports.name = fn.call()',
  'module.exports.name = fn.apply()',
  'exports.name = fn.apply()',
]
const objectExports = [
  'module.exports = { name1, name2, name3 }',
  'exports = { name1, name2, name3 }',
]
const notExports = [
  'var exports = 4',
  'let foo = { exports: 4}',
  'const foo = bar.exports',
  'const foo = derp.exports',
  'const foo = bar.exports.baz',
  'foo.map(exports => exports.module)',
  'foo.map(module => module.exports = bar)',
  'module.other.exports = bar',
  'module.other.exports = { exports }',
  'module.other.exports.foo = bar',
  'module.other.exports.foo = { exports }',
  'some.module.exports = baz',
  'some.module.exports = { exports }',
  'some.exports = baz',
  'some.module.exports.foo = baz',
  'some.module.exports.foo = { exports }',
  'some.exports.foo = baz',
  'some.exports.foo = { exports }',
  'some.module.other.exports = bar',
  'some.module.other.exports = { exports }',
  'some.other.exports = bar',
  'some.other.exports = { exports }',
  'some.module.other.exports.foo = baz',
  'some.module.other.exports.foo = { exports }',
  'some.other.exports.foo = baz',
  'some.other.exports.foo = { exports }',
]
const suites = {
  defaultExports,
  namedExports,
  objectExports,
  notExports,
}
testFactory({
  name: 'Core Plugin: Common.js Exports',
  plugin: cjsExportsPlugin,
  suites,
})
