module.exports = function(engine, db) {
  const filesToAppend = []
  const appendToFiles = () => {
    filesToAppend.forEach(({ id, value }) => {
      const vars =
        db
          .get('files')
          .find({ id })
          .value().vars || []
      db
        .get('files')
        .find({ id })
        .assign({ vars: [value, ...vars] })
        .write()
    })
  }
  engine.on('VariableDeclaration', (node, value) => {
    filesToAppend.push({ id: node.getFileName(), value })
  })
  engine.on('done', appendToFiles)
}
