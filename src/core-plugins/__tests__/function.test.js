const { testPlugin } = require('./utils/testPlugin')
const functionPlugin = require('../function')

const suites = {
  'Declared Function': {
    'function name () {}': [
      {
        file_id: '__TEST__',
        function_id: 'name@1:0',
      },
    ],
    '(function name(){})()': [
      {
        file_id: '__TEST__',
        function_id: 'name@1:1',
      },
    ],
    'const foo = function bar () {}': [
      {
        file_id: '__TEST__',
        function_id: 'bar@1:12',
        var_id: 'foo',
      },
    ],
  },
  'Function Expressions <anonymous>': {
    'const foo = function () {}': [
      {
        file_id: '__TEST__',
        function_id: 'anonymous@1:12',
        var_id: 'foo',
      },
    ],
    'const bar = () => {}': [
      {
        file_id: '__TEST__',
        var_id: 'bar',
        function_id: 'anonymous@1:12',
      },
    ],
    'const foo = () => () => () => () => {}': [
      {
        file_id: '__TEST__',
        var_id: 'foo',
        function_id: 'anonymous@1:12',
      },
      {
        file_id: '__TEST__',
        function_id: 'anonymous@1:18',
      },
      {
        file_id: '__TEST__',
        function_id: 'anonymous@1:24',
      },
      {
        file_id: '__TEST__',
        function_id: 'anonymous@1:30',
      },
    ],
  },
}

describe.only('Core Plugin: function', () => {
  Object.entries(suites).forEach(([suite, fns]) => {
    describe(suite, () => {
      Object.entries(fns).forEach(([fn, expected]) => {
        test(fn, async () => {
          const runTest = testPlugin({}, '__TEST__')
          const state = await runTest(functionPlugin, fn)
          const actual = state.function_collection
          expect(actual).toEqual(expected)
        })
      })
    })
  })
})
