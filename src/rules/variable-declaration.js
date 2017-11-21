module.exports = function(engine, store) {
  engine.on('VariableDeclaration', node => {
    console.log(node)
  })

  return store
}
