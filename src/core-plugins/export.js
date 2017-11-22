/*
  ExportNamedDeclaration
  ExportDefaultDeclaration
  ExportAllDeclaration
*/
module.exports = function(engine, db) {
  const filesToAppend = []
  const appendToFiles = () => {
    filesToAppend.forEach(({ key, id, value }) => {
      const args =
        db
          .get('files')
          .find({ id })
          .value()[key] || []
      db
        .get('files')
        .find({ id })
        .assign({ [key]: [value, ...args] })
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
      key: 'namedExports',
      value: {
        exportName,
        params,
        importHint: `import { ${exportName} } from '${state.getFileName()}'`,
        signature: `${exportName}(${params ? params.join(', ') : ''})`,
        tags: state.node.__doc_tags__,
      },
    })
  })
  // engine.on('ExportDefaultDeclaration', handleExport)
  // engine.on('ExportAllDeclaration', handleExport)

  engine.on('done', appendToFiles)
}
