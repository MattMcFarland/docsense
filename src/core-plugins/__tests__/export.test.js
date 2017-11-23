const { testPlugin, registerPlugin } = require('./utils/testPlugin')
const exportPlugin = require('../export')
const namedExports = [
  'export { name1, name2, name3 };',
  'export let name1, name2, name3;',
  'export { variable1 as name1, variable2 as name2, name3 };',
  'export let name1 = foo, name2 = bar, name3;',
  'export { name1, name2, name3 } from "baz"',
  'export { import1 as name1, import2 as name2, name3 } from "baz";',
]
const defaultExports = [
  'export default expression;',
  'export default function () { } ',
  'export default function name1() { } ',
  'export { name1 as default };',
]
const exportAll = 'export * from "baz"'

describe('core-plugin - export', () => {
  describe('Named Exports', () => {
    namedExports.forEach(namedExport => {
      test(namedExport, async () => {
        const initialState = { files: [{ id: '__TEST__' }] }
        state = await testPlugin(initialState, exportPlugin, namedExport)
        const actual = state.files[0].exports
        const expected = [
          { exportName: 'name1' },
          { exportName: 'name2' },
          { exportName: 'name3' },
        ]
        expect(actual).toEqual(expected)
      })
    })
  })
})
