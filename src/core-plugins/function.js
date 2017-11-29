// @flow
import type ParseEngine from '../parser/ParseEngine'
import helpers from '../parser/helpers'
import type types from '@babel/types'
import { getFunctionMeta } from './visitors/functionVisitor'
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
      ArrowFunctionExpression: handler,
      FunctionExpression: handler,
      FunctionDeclaration: handler,
    },
  }
  function handler(path, state) {
    const { getFileName } = helpers(path)
    const file_id = getFileName()
    const var_id = getVariableId(path)
    const { function_id, params, jsdoc } = getFunctionMeta(path, state)
    return push({
      function_id,
      file_id,
      var_id,
      params: params && params.length ? params : undefined,
      jsdoc,
    })
  }
}

function getVariableId(path) {
  return path.parentPath.isVariableDeclarator()
    ? path.parent.id.name
    : undefined
}
