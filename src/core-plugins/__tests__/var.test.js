const testFactory = require('./utils/testFactory')
const varPlugin = require('../var')

const singleVars = ['const foo = 1', 'const foo = () => {}']
const destructuredVars = ['const {var1, var2, var3}']

const suites = {
  'Single Vars': {
    'const foo = 1': [
      {
        file_id: '__TEST__',
        var_id: 'foo',
      },
    ],
    'const foo = () => 1': [
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
        var_id: 'baz',
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
}

testFactory('Core Plugin: var', varPlugin, 'var_collection', suites)
