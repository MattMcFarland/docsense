const testFactory = require('./utils/testFactory')
const exportPlugin = require('../export')

const expectedNameExports = [
  { export_id: 'name1', file_id: '__TEST__' },
  { export_id: 'name2', file_id: '__TEST__' },
  { export_id: 'name3', file_id: '__TEST__' },
]
const expectedDefaultExports = [{ export_id: 'default', file_id: '__TEST__' }]
const suites = {
  'Exporting local': {
    'export { name1, name2, name3 };': expectedNameExports,
    'export let name1, name2, name3;': expectedNameExports,
    'export { variable1 as name1, variable2 as name2, name3 };': expectedNameExports,
    'export let name1 = foo, name2 = bar, name3;': expectedNameExports,
    'export default expression;': expectedDefaultExports,
    'export { name1 as default };': expectedDefaultExports,
  },
  'Exporting externals': {
    'export * from "baz"': [
      { export_id: 'all', file_id: '__TEST__', source_id: 'baz' },
    ],
    'export { foo as default } from "other"': expectedDefaultExports,
    'export { name1, name2, name3 } from "baz"': expectedNameExports,
    'export { import1 as name1, import2 as name2, name3 } from "baz";': expectedNameExports,
  },
  'Exporting functions': {
    'export function foo () {}': [
      { export_id: 'foo', file_id: '__TEST__', function_id: 'foo@1:7' },
    ],
    'export const foo = () => {}': [
      { export_id: 'foo', file_id: '__TEST__', function_id: 'anonymous@1:19' },
    ],
    'export default function () {}': [
      {
        export_id: 'default',
        file_id: '__TEST__',
        function_id: 'anonymous@1:15',
      },
    ],
    'export const foo = function () {}': [
      { export_id: 'foo', file_id: '__TEST__', function_id: 'anonymous@1:19' },
    ],
    'export const foo = () => () => () => {}': [
      {
        export_id: 'foo',
        file_id: '__TEST__',
        function_id: 'anonymous@1:31',
      },
    ],
  },
  'exporting commented variables': [
    [
      `
      /**
       * Your Name
       * @property {string} name - the name
       */
      export const name = 'bob'
      `,
      [
        {
          export_id: 'name',
          file_id: '__TEST__',
          jsdoc: [
            {
              description: 'Your Name',
              tags: [
                {
                  description: 'the name',
                  name: 'name',
                  title: 'property',
                  type: { name: 'string', type: 'NameExpression' },
                },
              ],
            },
          ],
        },
      ],
    ],
    [
      `// this is not a jsdoc comment
      export const foo = 42
      `,
      [{ export_id: 'foo', file_id: '__TEST__' }],
    ],
  ],
  'Exporting commented functions': [
    [
      `
    /**
     * Create Super Hero
     * @param {object} param
     * @param {string} param.name - the name of your super hero
     * @param {string} param.ability - your hero's special ability
     * @returns {SuperHero} your new super hero!!
     */
    export const createSuperHero = ({name, ability}) => {}
    `,
      [
        {
          export_id: 'createSuperHero',
          file_id: '__TEST__',
          function_id: 'anonymous@9:35',
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
        },
      ],
    ],
  ],
}
describe('Core Plugin: export', () => {
  testFactory({ plugin: exportPlugin, suites })
})
