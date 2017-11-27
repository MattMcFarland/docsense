// @flow
import type ParseEngine from '../parser/ParseEngine'
import path from 'path'
module.exports = function(engine: ParseEngine, db: Lowdb): void {
  ;(db.set('function_collection', []): Lowdb).write()
  const push = data => {
    db
      .get('function_collection')
      .push(data)
      .write()
  }
  engine.on('ArrowFunctionExpression', ctx => {
    return handleFn(ctx, 'ArrowFunctionExpression')
  })
  engine.on('FunctionExpression', ctx => {
    return handleFn(ctx, 'FunctionExpression')
  })
  engine.on('FunctionDeclaration', ctx => {
    return handleFn(ctx, 'FunctionDeclaration')
  })
  function handleFn(ctx, nodeType) {
    const file_id = ctx.getFileName()
    const line = ctx.get('loc.start.line')
    const column = ctx.get('loc.start.column')
    const location_id = `${line}:${column}`
    const function_id = (ctx.get('id.name') || 'anonymous') + '@' + location_id
    const var_id = ctx.maybeVariableDeclaration()
    return push({
      function_id,
      file_id,
      var_id,
    })
  }
}
