// @flow
import type ParseEngine from '../parser/ParseEngine'
import helpers, { getFunctionMeta } from '../parser/helpers'
import functionVisitor from './visitors/functionVisitor'

export const collectionName = 'export_collection'
export default function(engine: ParseEngine, db: Lowdb): any {
  ;(db.set(collectionName, []): Lowdb).write()
  const createPush = path => data => {
    db
      .get(collectionName)
      .push(data)
      .write()
    path.traverse(functionVisitor(onFunction), data.export_id)
  }
  const insert = export_id => data => {
    db
      .get(collectionName)
      .find({ export_id })
      .assign(data)
      .write()
  }
  return {
    visitor: {
      ExportNamedDeclaration: handleExportNamedDeclaration,
      ExportSpecifier: handleExportSpecifier,
      ExportDefaultDeclaration: handleExportDefaultDeclaration,
      ExportAllDeclaration: handleExportAllDeclaration,
    },
  }
  function handleExportNamedDeclaration(path) {
    const push = createPush(path)
    if (path.node.specifiers.length) return
    const { getFileName, getDocTags } = helpers(path)
    const declarations = path.get('declaration.declarations')
    if (declarations && typeof declarations.forEach === 'function') {
      return declarations.forEach(exportDeclaration => {
        push({
          export_id: exportDeclaration.node.id.name,
          file_id: getFileName(),
          jsdoc: getDocTags(),
        })
      })
    }
    if (
      path.node.declaration &&
      path.node.declaration.type === 'FunctionDeclaration'
    ) {
      return push({
        export_id: path.node.declaration.id.name,
        file_id: getFileName(),
        jsdoc: getDocTags(),
      })
    }
    log.warn('export', 'skipped ExportNamedDeclaration', getFileName())
  }
  function handleExportSpecifier(path) {
    const push = createPush(path)
    const { getFileName, getDocTags } = helpers(path)
    push({
      export_id: path.get('exported.name').node,
      file_id: getFileName(),
      jsdoc: getDocTags(),
    })
  }
  function handleExportDefaultDeclaration(path) {
    const push = createPush(path)
    const { getFileName, getDocTags } = helpers(path)
    push({
      export_id: 'default',
      file_id: getFileName(),
      jsdoc: getDocTags(),
    })
  }
  function handleExportAllDeclaration(path) {
    const push = createPush(path)
    const { getFileName, getDocTags } = helpers(path)
    createPush(path)({
      export_id: 'all',
      file_id: getFileName(),
      source_id: path.get('source.value').node,
      jsdoc: getDocTags(),
    })
  }
  function onFunction(path, export_id) {
    if (!export_id) return
    const { function_id, params, jsdoc } = getFunctionMeta(path)
    insert(export_id)({
      function_id,
    })
  }
}
