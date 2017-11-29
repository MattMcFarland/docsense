const { testPlugin } = require('./testPlugin')

module.exports = (name, plugin, collection, suites) =>
  describe(name, () => {
    entries(suites).forEach(([suite, fns]) => {
      describe(suite, () => {
        entries(fns).forEach(([fn, expected]) => {
          test(fn, async () => {
            const runTest = testPlugin({}, '__TEST__')
            const state = await runTest(plugin, fn)
            const actual = state[collection]
            expect(actual).toEqual(expected)
          })
        })
      })
    })
  })

function entries(objOrArray) {
  if (Array.isArray(objOrArray)) {
    return objOrArray
  }
  return Object.entries(objOrArray)
}
