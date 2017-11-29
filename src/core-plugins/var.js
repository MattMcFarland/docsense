// @flow
import type ParseEngine from '../parser/ParseEngine'
import helpers, { getFunctionMeta } from '../parser/helpers'
import type types from '@babel/types'
import functionVisitor from './visitors/functionVisitor'

module.exports = function(engine: ParseEngine, db: Lowdb, types: types): any {
  ;(db.set('var_collection', []): Lowdb).write()
  const createPush = path => data => {
    db
      .get('var_collection')
      .push(data)
      .write()
    path.traverse(functionVisitor(onFunction))
  }
  const insert = var_id => data => {
    db
      .get('var_collection')
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
    const { function_id, params, jsdoc } = getFunctionMeta(path)
    insert(var_id)({
      function_id,
    })
  }
  function handleDeclarator(path, state) {
    const { getFileName } = helpers(path)
    const file_id = getFileName()
    const push = createPush(path)
    switch (path.node.id.type) {
      case 'Identifier':
        const var_id = path.node.id.name
        push({
          file_id,
          var_id,
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
            const var_id = prop.name
            push({
              file_id,
              var_id: prop.name,
              jsdoc: getDocTags(path.get('id')),
            })
          }
          if (prop.type === 'RestElement') {
            const var_id = prop.argument.name
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

  function getDocTags(path) {
    const tags =
      path.node.__doc_tags__ ||
      path.getStatementParent().node.__doc_tags__ ||
      path.parent.__doc_tags__
    return tags && tags.length ? tags : undefined
  }
}

function getVariableId(path) {
  return path.parentPath.isVariableDeclarator()
    ? path.parent.id.name
    : undefined
}
