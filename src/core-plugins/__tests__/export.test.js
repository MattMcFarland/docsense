const { testPlugin } = require('./utils/testPlugin')
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

describe('Core Plugin: export', () => {
  describe('Named Exports', () => {
    namedExports.forEach(namedExport => {
      test(namedExport, async () => {
        const runTest = testPlugin({}, '__TEST__')
        const state = await runTest(exportPlugin, namedExport)
        const actual = state.export_collection
        const expected = [
          { export_id: 'name1', file_id: '__TEST__' },
          { export_id: 'name2', file_id: '__TEST__' },
          { export_id: 'name3', file_id: '__TEST__' },
        ]
        expect(actual).toEqual(expected)
      })
    })
  })
  describe('Default Exports', () => {
    defaultExports.forEach(defaultExport => {
      test(defaultExport, async () => {
        const runTest = testPlugin({}, '__TEST__')
        const state = await runTest(exportPlugin, defaultExport)
        const actual = state.export_collection
        const expected = [{ export_id: 'default', file_id: '__TEST__' }]
        expect(actual).toEqual(expected)
      })
    })
  })
  describe('Export All', () => {
    test(exportAll, async () => {
      const runTest = testPlugin({}, '__TEST__')
      const state = await runTest(exportPlugin, exportAll)
      const actual = state.export_collection
      const expected = [
        { export_id: 'all', file_id: '__TEST__', source_id: 'baz' },
      ]
      expect(actual).toEqual(expected)
    })
  })
})
