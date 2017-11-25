const { testPlugin } = require('./utils/testPlugin')
const functionPlugin = require('../function')

const fns = [['name', ['a', 'b', 'c']], ['name', []]]
const buildFn = (arrow, args) =>
  `${!arrow ? 'function ' : ''}(${args && args.join(',')}) ${arrow ? '=>' : ''}`

const declareFn = (name, args) =>
  `function ${name} (${args && args.join(',')}) {}`
const declareDefaultFn = args =>
  `export default function (${args.join(',')}) {}`
const defaultExpressFn = (name, arrow, args) =>
  `export default function ${name} = (${args.join(',')}) {}`
const expressIFFE = (name, args) =>
  `(function ${name}(${args && args.join(',')}) {})()`
const expressVar = (name, arrow, args) =>
  `const ${name} = ${buildFn(arrow, args)} {}`
const expressProp = (name, arrow, args) =>
  `const obj = { ${name}: ${buildFn(arrow, args)} {} }`
const exportFn = (name, arrow, args) =>
  `export const ${name} = ${buildFn(arrow, args)} {}`
const moduleFn = (name, arrow, args) =>
  `module.exports = ${buildFn(arrow, args)} {}`
const exportsFn = (name, arrow, args) => `exports = ${buildFn(arrow, args)} {}`

const declaredFns = fns.map(([name, args]) => declareFn(name, args))
const declaredDefaultFunctions = fns.map(([name, args]) =>
  declareDefaultFn(args)
)
const expressIFFEs = fns.map(([name, args]) => expressIFFE(name, args))
const expressVars = fns.map(([name, args]) => expressVar(name, false, args))
const expressProps = fns.map(([name, args]) => expressProp(name, false, args))
const exportFns = fns.map(([name, args]) => exportFn(name, false, args))
const modulesFns = fns.map(([name, args]) => moduleFn(name, false, args))
const exportsFns = fns.map(([name, args]) => exportsFn(name, false, args))

const arrowVars = fns.map(([name, args]) => expressVar(name, true, args))
const arrowProps = fns.map(([name, args]) => expressProp(name, true, args))
const exportArrowFns = fns.map(([name, args]) => exportFn(name, true, args))
const modulesArrowFns = fns.map(([name, args]) => moduleFn(name, true, args))
const exportsArrowFns = fns.map(([name, args]) => exportsFn(name, true, args))

describe('Core Plugin: function', () => {
  describe('Declared Function', () => {
    declaredFns.forEach(fn => {
      test(fn, async () => {
        const runTest = testPlugin({}, '__TEST__')
        const state = await runTest(functionPlugin, fn)
        const actual = state.function_collection
        const expected = [
          { file_id: '__TEST__', function_id: 'name', location_id: '1:0' },
        ]
        expect(actual).toEqual(expected)
      })
    })
  })
  describe('Export Default Declared Function', () => {
    declaredDefaultFunctions.forEach(fn => {
      test(fn, async () => {
        const runTest = testPlugin({}, '__TEST__')
        const state = await runTest(functionPlugin, fn)
        const actual = state.function_collection
        const expected = [
          {
            export_id: 'default',
            file_id: '__TEST__',
            function_id: 'default',
            location_id: '1:15',
          },
        ]
        expect(actual).toEqual(expected)
      })
    })
  })
  describe('Function Expressions', () => {
    expressIFFEs.forEach(fn => {
      test(fn, async () => {
        const runTest = testPlugin({}, '__TEST__')
        const state = await runTest(functionPlugin, fn)
        const actual = state.function_collection
        const expected = [
          {
            file_id: '__TEST__',
            function_id: 'name',
            location_id: '1:1',
          },
        ]
        expect(actual).toEqual(expected)
      })
    })
    expressVars.forEach(fn => {
      test(fn, async () => {
        const runTest = testPlugin({}, '__TEST__')
        const state = await runTest(functionPlugin, fn)
        const actual = state.function_collection
        const expected = [
          {
            file_id: '__TEST__',
            function_id: 'name',
            location_id: '1:13',
          },
        ]
        expect(actual).toEqual(expected)
      })
    })
    expressProps.forEach(fn => {
      test(fn, async () => {
        const runTest = testPlugin({}, '__TEST__')
        const state = await runTest(functionPlugin, fn)
        const actual = state.function_collection
        const expected = [
          {
            file_id: '__TEST__',
            function_id: 'name',
            location_id: '1:20',
          },
        ]
        expect(actual).toEqual(expected)
      })
    })
    modulesFns.forEach(fn => {
      test(fn, async () => {
        const runTest = testPlugin({}, '__TEST__')
        const state = await runTest(functionPlugin, fn)
        const actual = state.function_collection
        const expected = [
          {
            export_id: 'name',
            file_id: '__TEST__',
            function_id: 'name',
            location_id: '1:20',
          },
        ]
        expect(actual).toEqual(expected)
      })
    })
    exportsFns.forEach(fn => {
      test(fn, async () => {
        const runTest = testPlugin({}, '__TEST__')
        const state = await runTest(functionPlugin, fn)
        const actual = state.function_collection
        const expected = [
          {
            export_id: 'name',
            file_id: '__TEST__',
            function_id: 'name',
            location_id: '1:20',
          },
        ]
        expect(actual).toEqual(expected)
      })
    })
  })
  describe('Arrow Expressions', () => {
    arrowVars.forEach(fn => {
      test(fn, async () => {
        const runTest = testPlugin({}, '__TEST__')
        const state = await runTest(functionPlugin, fn)
        const actual = state.function_collection
        const expected = [
          {
            file_id: '__TEST__',
            function_id: 'name',
            location_id: '1:13',
          },
        ]
        expect(actual).toEqual(expected)
      })
    })
    arrowProps.forEach(fn => {
      test(fn, async () => {
        const runTest = testPlugin({}, '__TEST__')
        const state = await runTest(functionPlugin, fn)
        const actual = state.function_collection
        const expected = [
          {
            file_id: '__TEST__',
            function_id: 'name',
            location_id: '1:20',
          },
        ]
        expect(actual).toEqual(expected)
      })
    })
    exportArrowFns.forEach(fn => {
      test(fn, async () => {
        const runTest = testPlugin({}, '__TEST__')
        const state = await runTest(functionPlugin, fn)
        const actual = state.function_collection
        const expected = [
          {
            export_id: 'name',
            file_id: '__TEST__',
            function_id: 'name',
            location_id: '1:20',
          },
        ]
        expect(actual).toEqual(expected)
      })
    })
    modulesArrowFns.forEach(fn => {
      test(fn, async () => {
        const runTest = testPlugin({}, '__TEST__')
        const state = await runTest(functionPlugin, fn)
        const actual = state.function_collection
        const expected = [
          {
            file_id: '__TEST__',
            function_id: 'name',
            location_id: '1:17',
          },
        ]
        expect(actual).toEqual(expected)
      })
    })
    exportsArrowFns.forEach(fn => {
      test(fn, async () => {
        const runTest = testPlugin({}, '__TEST__')
        const state = await runTest(functionPlugin, fn)
        const actual = state.function_collection
        const expected = [
          {
            file_id: '__TEST__',
            function_id: 'anonymous',
            location_id: '1:10',
          },
        ]
        expect(actual).toEqual(expected)
      })
    })
  })
  describe('Complex Functions', () => {
    const complex = {
      'function Foo () { return () => ({})}': [
        {
          file_id: '__TEST__',
          function_id: 'Foo',
          location_id: '1:0',
        },
        {
          file_id: '__TEST__',
          function_id: 'anonymous',
          location_id: '1:25',
        },
      ],
      'const foo = () => { return () => ({})}': [
        {
          file_id: '__TEST__',
          function_id: 'foo',
          location_id: '1:12',
        },
        {
          file_id: '__TEST__',
          function_id: 'anonymous',
          location_id: '1:27',
        },
      ],
      'module.exports.foo = foo(()=>{})': [
        {
          file_id: '__TEST__',
          function_id: 'anonymous',
          location_id: '1:25',
        },
      ],
      'module.exports.foo = function () {}': [
        {
          file_id: '__TEST__',
          function_id: 'foo',
          location_id: '1:21',
        },
      ],
      'exports.foo = function bar () {}': [
        {
          file_id: '__TEST__',
          function_id: 'foo',
          location_id: '1:14',
        },
      ],
      'module.exports.foo = () => bar': [
        {
          file_id: '__TEST__',
          function_id: 'foo',
          location_id: '1:21',
        },
      ],
      'exports.foo.bar = () => bar': [
        {
          file_id: '__TEST__',
          function_id: 'bar',
          location_id: '1:18',
        },
      ],
      'exports = { foo: () => bar, bar: () => baz }': [
        {
          file_id: '__TEST__',
          function_id: 'foo',
          location_id: '1:17',
        },
        {
          file_id: '__TEST__',
          function_id: 'bar',
          location_id: '1:33',
        },
      ],
      'module.exports = { foo: () => bar, bar: () => baz }': [
        {
          file_id: '__TEST__',
          function_id: 'foo',
          location_id: '1:24',
        },
        {
          file_id: '__TEST__',
          function_id: 'bar',
          location_id: '1:40',
        },
      ],
    }
    Object.entries(complex).forEach(([fn, expected]) => {
      test(fn, async () => {
        const runTest = testPlugin({}, '__TEST__')
        const state = await runTest(functionPlugin, fn)
        const actual = state.function_collection
        expect(actual).toEqual(expected)
      })
    })
  })
})
