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
  function handleFn(path) {
    const { getFileName } = helpers(path)
    const file_id = getFileName()
    const line = path.get('loc.start.line').node
    const column = path.get('loc.start.column').node
    const id = path.get('id').node
    const location_id = `${line}:${column}`
    const function_id =
      (id ? path.get('id.name').node : 'anonymous') + '@' + location_id
    return push({
      function_id,
      file_id,
    })
    // console.log(file_id)
    // const line = path.get('loc.start.line')
    // const column = path.get('loc.start.column')
    // const location_id = `${line}:${column}`
    // const function_id = (path.get('id.name') || 'anonymous') + '@' + location_id
  }
  function getParams(ctx) {}
}
