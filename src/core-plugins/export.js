/*
  ExportNamedDeclaration
  ExportDefaultDeclaration
  ExportAllDeclaration
*/
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
  const handleExport = (state, value) => {
    filesToAppend.push({ id: state.getFileName(), value })
  }
  engine.on('ExportNamedDeclaration', (state, value) => {
    const exportName = state.node.declaration.declarations[0].id.name
    const _p = state.node.declaration.declarations[0].init.params
    const params = _p && _p.map(param => param.name)
    filesToAppend.push({
      id: state.getFileName(),
      value: {
        exportName,
        params,
      },
    })
  })
  // engine.on('ExportDefaultDeclaration', handleExport)
  // engine.on('ExportAllDeclaration', handleExport)

  engine.on('done', appendToFiles)
}
