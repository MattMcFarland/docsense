// @flow
import type ParseEngine from '../parser/ParseEngine'
import helpers, { getFileName } from '../parser/helpers'

module.exports = function(engine: ParseEngine, db: Lowdb): void {
  ;(db.set('export_collection', []): Lowdb).write()
  const push = data => {
    db
      .get('export_collection')
      .push(data)
      .write()
  }
  engine.on('ExportNamedDeclaration', path => {
    if (path.node.specifiers.length) return
    const { select, getFileName } = helpers(path)
    const declarations = select('declaration.declarations')
    if (declarations && typeof declarations.forEach === 'function') {
      declarations.forEach(exportDeclaration => {
        push({
          export_id: exportDeclaration.node.id.name,
          file_id: getFileName(),
        })
      })
    }
  })
  engine.on('ExportSpecifier', path => {
    push({
      export_id: path.get('exported.name').node,
      file_id: getFileName(path),
    })
  })
  engine.on('ExportDefaultDeclaration', path => {
    push({ export_id: 'default', file_id: getFileName(path) })
  })
  engine.on('ExportAllDeclaration', path => {
    push({
      export_id: 'all',
      file_id: getFileName(path),
      source_id: path.get('source.value').node,
    })
  })
}
