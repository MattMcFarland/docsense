const { testPlugin } = require('./testPlugin')
const assert = require('assert')
const tester = flag => ({ name, plugin, suites }) => {
  assert(name, 'testFactory missing name argument')
  assert(plugin, 'testFactory missing plugin argument')
  assert(suites, 'testFactory missing suite argument')
  const collection = plugin.collectionName
  const desc = flag ? describe[flag] : describe
  const t = flag ? test[flag] : test
  desc(name, () => {
    entries(suites).forEach(([suite, fns]) => {
      desc(suite, () => {
        entries(fns).forEach(entryOrSnapshotTest => {
          if (entryOrSnapshotTest.length === 2) {
            const [fn, expected] = entryOrSnapshotTest
            t(fn, async () => {
              const runTest = testPlugin({}, '__TEST__')
              const state = await runTest(plugin, fn)
              const actual = state[collection]
              expect(actual).toEqual(expected)
            })
          } else {
            t(entryOrSnapshotTest, async () => {
              const runTest = testPlugin({}, '__TEST__')
              const state = await runTest(plugin, entryOrSnapshotTest)
              const actual = state[collection]
              expect(actual).toMatchSnapshot()
            })
          }
        })
      })
    })
  })
}
module.exports = tester()

module.exports.skip = tester('skip')
module.exports.only = tester('only')

function entries(objOrArray) {
  if (Array.isArray(objOrArray)) {
    return objOrArray
  }
  return Object.entries(objOrArray)
}
