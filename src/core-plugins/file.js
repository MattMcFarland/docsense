module.exports = function(engine, store) {
  // engine.on('File', (node, value) => {
  //   console.log(require('util').inspect(value.loc, true, 1, true))
  // })
  store.set('category', 'files')
  return store
}
