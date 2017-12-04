import testFactory from './utils/testFactory';
const fnPlugin = require('../function');
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
        function_id: 'anonymous@1:12',
        var_id: 'bar',
      },
    ],
    'const foo = () => () => () => () => {}': [
      {
        file_id: '__TEST__',
        function_id: 'anonymous@1:12',
        var_id: 'foo',
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
  'Function with Params': {
    'const fn = (foo, bar, baz) => {}': [
      {
        file_id: '__TEST__',
        function_id: 'anonymous@1:11',
        var_id: 'fn',
        params: ['foo', 'bar', 'baz'],
      },
    ],
    'const fn = ({foo, bar}, baz) => {}': [
      {
        file_id: '__TEST__',
        function_id: 'anonymous@1:11',
        var_id: 'fn',
        params: [
          [{ key: 'foo', value: 'foo' }, { key: 'bar', value: 'bar' }],
          'baz',
        ],
      },
    ],
    'const fn = ({foo: fooey, bar: barey}, baz) => {}': [
      {
        file_id: '__TEST__',
        function_id: 'anonymous@1:11',
        var_id: 'fn',
        params: [
          [{ key: 'foo', value: 'fooey' }, { key: 'bar', value: 'barey' }],
          'baz',
        ],
      },
    ],
    'const fn = ({foo: fooey, bar: barey}, ...baz) => {}': [
      {
        file_id: '__TEST__',
        function_id: 'anonymous@1:11',
        var_id: 'fn',
        params: [
          [{ key: 'foo', value: 'fooey' }, { key: 'bar', value: 'barey' }],
          '...baz',
        ],
      },
    ],
    'foo.map(([, foo, bar, ...baz]) => foo + 1)': [
      {
        file_id: '__TEST__',
        function_id: 'anonymous@1:8',
        params: [['null', 'foo', 'bar', '...baz']],
      },
    ],
    '/** add two numbers\n*@param {number} a add a number\n@param {number} b with this number\n@returns {number} a + b\n */\nconst add = (a, b) => a + b': [
      {
        file_id: '__TEST__',
        function_id: 'anonymous@6:12',
        params: ['a', 'b'],
        var_id: 'add',
        jsdoc: [
          {
            description: 'add two numbers',
            tags: [
              {
                title: 'param',
                description: 'add a number',
                type: {
                  type: 'NameExpression',
                  name: 'number',
                },
                name: 'a',
              },
              {
                title: 'param',
                description: 'with this number',
                type: {
                  type: 'NameExpression',
                  name: 'number',
                },
                name: 'b',
              },
              {
                title: 'returns',
                description: 'a + b',
                type: {
                  type: 'NameExpression',
                  name: 'number',
                },
              },
            ],
          },
        ],
      },
    ],
    'const obj = { /** add two numbers\n * @param {number} a add a number\n * @param {number} b with this number\n@returns {number} a + b */ add: (a, b) => {}}': [
      {
        file_id: '__TEST__',
        function_id: 'anonymous@4:32',
        params: ['a', 'b'],
        jsdoc: [
          {
            description: 'add two numbers',
            tags: [
              {
                title: 'param',
                description: 'add a number',
                type: {
                  type: 'NameExpression',
                  name: 'number',
                },
                name: 'a',
              },
              {
                title: 'param',
                description: 'with this number',
                type: {
                  type: 'NameExpression',
                  name: 'number',
                },
                name: 'b',
              },
              {
                title: 'returns',
                description: 'a + b',
                type: {
                  type: 'NameExpression',
                  name: 'number',
                },
              },
            ],
          },
        ],
      },
    ],
  },
};
describe('Core Plugin: Function', () => {
  testFactory({
    plugin: fnPlugin,
    suites,
  });
});
