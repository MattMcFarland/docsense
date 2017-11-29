// @flow
import type ParseEngine from '../parser/ParseEngine'
import helpers from '../parser/helpers'
import type types from '@babel/types'

module.exports = function(engine: ParseEngine, db: Lowdb, types: types): any {
  ;(db.set('var_collection', []): Lowdb).write()
  const push = data => {
    db
      .get('var_collection')
      .push(data)
      .write()
  }
  return {
    visitor: {
      VariableDeclarator: handleDeclarator,
    },
  }
  function handleDeclarator(path, state) {
    const { getFileName } = helpers(path)
    const file_id = getFileName()
    switch (path.node.id.type) {
      case 'Identifier':
        return push({
          file_id,
          var_id: path.node.id.name,
          jsdoc: getDocTags(path),
        })
      case 'ObjectPattern':
        return path.node.id.properties.forEach(prop => {
          push({
            file_id,
            var_id: prop.value.name,
            jsdoc: getDocTags(path.get('id')),
          })
        })
      case 'ArrayPattern':
        return path.node.id.elements.forEach(prop => {
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
