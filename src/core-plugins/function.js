// @flow
import type ParseEngine from '../parser/ParseEngine'
import helpers from '../parser/helpers'
import type types from '@babel/types'

module.exports = function(engine: ParseEngine, db: Lowdb, types: types): any {
  ;(db.set('function_collection', []): Lowdb).write()
  const push = data => {
    db
      .get('function_collection')
      .push(data)
      .write()
  }
  return {
    visitor: {
      ArrowFunctionExpression: handleFn,
      FunctionExpression: handleFn,
      FunctionDeclaration: handleFn,
    },
  }
  function handleFn(path, state) {
    const { getFileName } = helpers(path)
    const file_id = getFileName()
    const line = path.get('loc.start.line').node
    const column = path.get('loc.start.column').node
    const id = path.get('id').node
    const location_id = `${line}:${column}`
    const function_id =
      (id ? path.get('id.name').node : 'anonymous') + '@' + location_id
    const var_id = getVariableId(path)
    const params = getParams(path)
    const jsdoc = getDocTags(path)
    return push({
      function_id,
      file_id,
      var_id,
      params: params.length ? params : undefined,
      jsdoc,
    })
  }
  function getVariableId(path) {
    return path.parentPath.isVariableDeclarator()
      ? path.parent.id.name
      : undefined
  }
  function getObjectKey(path) {
    return path.parentPath.isObjectProperty() ? path.parent.key.name : undefined
  }
  function getParams(path) {
    return path.node.params.map(param => {
      if (param.type === 'Identifier') {
        return param.name
      }
      if (param.type === 'ObjectPattern') {
        return param.properties.map(({ key, value }) => ({
          key: key.name,
          value: value.name,
        }))
      }
      if (param.type === 'ArrayPattern') {
        return param.elements.map(el => {
          if (el) {
            if (el.type === 'Identifier') {
              return el.name
            }
            if (el.type === 'RestElement') {
            }
            return '...' + el.argument.name
          }
          return null
        })
      }
      if (param.type === 'RestElement') {
        return '...' + param.argument.name
      }
    })
  }
  function getDocTags(path) {
    return (
      path.getStatementParent().node.__doc_tags__ || path.parent.__doc_tags__
    )
  }
}
