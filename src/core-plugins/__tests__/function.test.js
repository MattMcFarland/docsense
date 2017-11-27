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
            file_id: '__TEST__',
            function_id: 'anonymous',
            location_id: '1:15',
          },
        ]
        expect(actual).toEqual(expected)
      })
    })
  })
  describe('Export Named Function', () => {
    exportFns.forEach(fn => {
      test(fn, async () => {
        const runTest = testPlugin({}, '__TEST__')
        const state = await runTest(functionPlugin, fn)
        const actual = state.function_collection
        const expected = [
          {
            file_id: '__TEST__',
            function_id: 'anonymous',
            location_id: '1:20',
          },
        ]
        expect(actual).toEqual(expected)
      })
    })
  })
  describe.only('Function Expressions', () => {
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
            function_id: 'anonymous',
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
            function_id: 'anonymous',
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
            file_id: '__TEST__',
            function_id: 'anonymous',
            location_id: '1:17',
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
            file_id: '__TEST__',
            function_id: 'anonymous',
            location_id: '1:10',
          },
        ]
        expect(actual).toEqual(expected)
      })
    })
  })
  describe.only('Arrow Expressions', () => {
    arrowVars.forEach(fn => {
      test(fn, async () => {
        const runTest = testPlugin({}, '__TEST__')
        const state = await runTest(functionPlugin, fn)
        const actual = state.function_collection
        const expected = [
          {
            file_id: '__TEST__',
            function_id: 'anonymous',
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
            function_id: 'anonymous',
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
            file_id: '__TEST__',
            function_id: 'anonymous',
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
            function_id: 'anonymous',
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
})
