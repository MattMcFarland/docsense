// @flow
import type ParseEngine from '../parser/ParseEngine'
import helpers, {
  getFunctionMeta,
  getDocTags,
  getVariableId,
} from '../parser/helpers'
import type types from '@babel/types'
import functionVisitor from './visitors/functionVisitor'

export const collectionName = 'var_collection'
export default function(engine: ParseEngine, db: Lowdb, types: types): any {
  (db.set(collectionName, []): Lowdb).write()
  const createPush = path => data => {
    db
      .get(collectionName)
      .push(data)
      .write()
    path.traverse(functionVisitor(onFunction))
  }
  const insert = var_id => data => {
    db
      .get(collectionName)
      .find({ var_id })
      .assign(data)
      .write()
  }
  return {
    visitor: {
      VariableDeclarator: handleDeclarator,
    },
  }
  function onFunction(path) {
    const var_id = getVariableId(path)
    if (!var_id) return
    const { function_id } = getFunctionMeta(path)
    insert(var_id)({
      function_id,
    })
  }
  function handleDeclarator(path) {
    const { getFileName } = helpers(path)
    const file_id = getFileName()
    const push = createPush(path)
    switch (path.node.id.type) {
      case 'Identifier':
        push({
          file_id,
          var_id: path.node.id.name,
          jsdoc: getDocTags(path),
        })
        break
      case 'ObjectPattern':
        path.node.id.properties.forEach(prop => {
          const var_id = prop.value.name
          push({
            file_id,
            var_id,
            jsdoc: getDocTags(path.get('id')),
          })
        })
        break
      case 'ArrayPattern':
        path.node.id.elements.forEach(prop => {
          if (prop.type === 'Identifier') {
            push({
              file_id,
              var_id: prop.name,
              jsdoc: getDocTags(path.get('id')),
            })
          }
          if (prop.type === 'RestElement') {
            push({
              file_id,
              var_id: prop.argument.name,
              jsdoc: getDocTags(path.get('id')),
            })
          }
        })
        break
    }
  }
}
