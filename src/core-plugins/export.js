/*
  ExportNamedDeclaration
  ExportDefaultDeclaration
  ExportAllDeclaration
*/
module.exports = function(engine, db) {
  // console.log('register plugin', db.getState().files[0])
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

  engine.on('ExportNamedDeclaration', (state, value) => {
    const exportName = state.node.declaration.declarations[0].id.name
    const _p = state.node.declaration.declarations[0].init.params
    const params = _p && _p.map(param => param.name)

    filesToAppend.push({
      id: state.getFileName(),
      key: 'exports',
      value: {
        exportName,
      },
    })
  })
  // engine.on('ExportDefaultDeclaration', handleExport)
  // engine.on('ExportAllDeclaration', handleExport)

  engine.on('done', appendToFiles)
}

function nodeIsFunction() {
  // finds function here: function a () {}
}

function getParamsFromFunction() {}
