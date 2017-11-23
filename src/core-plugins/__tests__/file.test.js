const { testPlugin, registerPlugin } = require('./utils/testPlugin')
const filePlugin = require('../file')

describe('Core Plugin: file', () => {
  test('file names are added as file_id', async () => {
    const runTest = testPlugin({}, '__TEST__')
    const state = await runTest(filePlugin, 'foo()')
    const actual = state.file_collection
    const expected = [{ file_id: '__TEST__' }]
    expect(actual).toEqual(expected)
  })
})
