import testFactory from './utils/testFactory';
const varPlugin = require('../var');

const suites = {
  'Single Vars': {
    'const foo = 1': [
      {
        file_id: '__TEST__',
        var_id: 'foo',
      },
    ],
  },
  'Multiple Vars': {
    'var foo = 1, bar = 2, baz = 3': [
      {
        file_id: '__TEST__',
        var_id: 'foo',
      },
      {
        file_id: '__TEST__',
        var_id: 'bar',
      },
      {
        file_id: '__TEST__',
        var_id: 'baz',
      },
    ],
  },
  'Destructured Vars': {
    'const { foo, bar, baz } = spooky()': [
      {
        file_id: '__TEST__',
        var_id: 'foo',
      },
      {
        file_id: '__TEST__',
        var_id: 'bar',
      },
      {
        file_id: '__TEST__',
        var_id: 'baz',
      },
    ],
    'const [foo, bar, ...baz ] = spooky()': [
      {
        file_id: '__TEST__',
        var_id: 'foo',
      },
      {
        file_id: '__TEST__',
        var_id: 'bar',
      },
      {
        file_id: '__TEST__',
        var_id: '...baz',
      },
    ],
    'const { a: foo, b: bar, c: baz } = spooky()': [
      {
        file_id: '__TEST__',
        var_id: 'foo',
      },
      {
        file_id: '__TEST__',
        var_id: 'bar',
      },
      {
        file_id: '__TEST__',
        var_id: 'baz',
      },
    ],
  },
  'With Comments': [
    [
      `
      /**
       * Your Name
       * @property {string} name - the name
       */
      const name = 'bob'
      `,
      [
        {
          file_id: '__TEST__',
          var_id: 'name',
          jsdoc: [
            {
              description: 'Your Name',
              tags: [
                {
                  title: 'property',
                  description: 'the name',
                  type: { type: 'NameExpression', name: 'string' },
                  name: 'name',
                },
              ],
            },
          ],
        },
      ],
    ],
    [
      `// this is not a jsdoc comment
      const foo = 42
      `,
      [
        {
          file_id: '__TEST__',
          var_id: 'foo',
        },
      ],
    ],
  ],
  'With Functions': {
    'const foo = function () {}': [
      {
        file_id: '__TEST__',
        var_id: 'foo',
        function_id: 'anonymous@1:12',
      },
    ],
    'const foo = () => () => () => {}': [
      {
        file_id: '__TEST__',
        var_id: 'foo',
        function_id: 'anonymous@1:12',
      },
    ],
  },
  'With Commented Functions': [
    [
      `
    /**
     * Create Super Hero
     * @param {object} param
     * @param {string} param.name - the name of your super hero
     * @param {string} param.ability - your hero's special ability
     * @returns {SuperHero} your new super hero!!
     */
    const createSuperHero = ({name, ability}) => {}
    `,
      [
        {
          file_id: '__TEST__',
          function_id: 'anonymous@9:28',
          jsdoc: [
            {
              description: 'Create Super Hero',
              tags: [
                {
                  description: null,
                  name: 'param',
                  title: 'param',
                  type: { name: 'object', type: 'NameExpression' },
                },
                {
                  description: 'the name of your super hero',
                  name: 'param.name',
                  title: 'param',
                  type: { name: 'string', type: 'NameExpression' },
                },
                {
                  description: "your hero's special ability",
                  name: 'param.ability',
                  title: 'param',
                  type: { name: 'string', type: 'NameExpression' },
                },
                {
                  description: 'your new super hero!!',
                  title: 'returns',
                  type: { name: 'SuperHero', type: 'NameExpression' },
                },
              ],
            },
          ],
          var_id: 'createSuperHero',
        },
      ],
    ],
  ],
};

describe('Core Plugin: Var', () => {
  testFactory({
    plugin: varPlugin,
    suites,
  });
});
