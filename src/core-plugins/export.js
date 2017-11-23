// @flow
import type ParseEngine from '../parser/ParseEngine'

module.exports = function(engine: ParseEngine, db: Lowdb): void {
  ;(db.set('export_collection', []): Lowdb).write()
  const push = data => {
    db
      .get('export_collection')
      .push(data)
      .write()
  }
  engine.on('ExportNamedDeclaration', ctx => {
    const declarations = ctx.getDeclarations()
    if (declarations) {
      declarations.forEach(exportDeclaration => {
        push({
          export_id: exportDeclaration.id.name,
          file_id: ctx.getFileName(),
        })
      })
    }
  })
  engine.on('ExportSpecifier', ctx => {
    push({ export_id: ctx.get('exported.name'), file_id: ctx.getFileName() })
  })
  engine.on('ExportDefaultDeclaration', ctx => {
    push({ export_id: 'default', file_id: ctx.getFileName() })
  })
  engine.on('ExportAllDeclaration', ctx => {
    push({
      export_id: 'all',
      file_id: ctx.getFileName(),
      source_id: ctx.get('source.value'),
    })
  })
}
