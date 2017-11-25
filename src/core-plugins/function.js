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
    const export_id = getExportId(ctx)
    const function_id = getFunctionId(ctx, nodeType)
    const file_id = ctx.getFileName()
    const line = ctx.get('loc.start.line')
    const column = ctx.get('loc.start.column')
    const location_id = `${line}:${column}`
    if (export_id) {
      return push({
        export_id: export_id === 'function_id' ? function_id : export_id,
        function_id,
        file_id,
        location_id,
      })
    }
    return push({
      function_id,
      file_id,
      location_id,
    })
  }
  function getExportId(ctx) {
    if (!isCurried(ctx)) {
      if (ctx.pathByType.includes('ExportDefaultDeclaration')) {
        return 'default'
      }
      if (
        ctx.pathByType.includes('ExportNamedDeclaration') ||
        ctx.pathByType.includes('ExportSpecifier')
      ) {
        return 'function_id'
      }
    }
  }
  function getFunctionId(ctx, nodeType) {
    if (ctx.get('id.name')) {
      return ctx.get('id.name')
    }
    let parent = ctx.select('parent')
    let parentNodeType = parent.get('type')
    let parentNodeName = parent.get('id.name')
    while (!parentNodeType) {
      parent = parent.select('parent')
      parentNodeType = parent.get('type')
      parentNodeName = parent.get('id.name')
      if (parent.key === 'arguments' || parent.key === 'body') {
        parentNodeType = 'anonymous'
      }
    }
    if (
      parentNodeType === 'CallExpression' ||
      parentNodeType === 'ArrowFunctionExpression' ||
      parentNodeType === 'NewExpression'
    ) {
      return 'anonymous'
    }
    if (parentNodeType === 'VariableDeclarator') {
      if (parentNodeName) return parentNodeName
    }
    if (parentNodeType === 'AssignmentExpression') {
      return parent.get('left.property.name')
    }
    if (parentNodeType === 'ExportDefaultDeclaration') {
      return 'default'
    }
    if (parentNodeName) {
      return parentNodeName
    }
    if (parentNodeType) {
      return parentNodeType
    }

    return 'anonymous'
  }

  function isCurried(ctx) {
    const { pathByType } = ctx
    const beforeThisOne = pathByType.length - 1
    function isInThePath(type, length) {
      const index = pathByType.indexOf(type)
      return index > 1 && index <= length
    }
    return (
      isInThePath('ArrowFunctionExpression', beforeThisOne) ||
      isInThePath('FunctionDeclaration', beforeThisOne) ||
      isInThePath('FunctionExpression', beforeThisOne)
    )
  }
}
