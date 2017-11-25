// @flow
import type ParseEngine from '../parser/ParseEngine'

module.exports = function(engine: ParseEngine, db: Lowdb): void {
  ;(db.set('cjsExports_collection', []): Lowdb).write()
  const push = data => {
    db
      .get('cjsExports_collection')
      .push(data)
      .write()
  }
  engine.on('Identifier', ctx => {
    if (!validate(ctx)) return

    // the expression
    const parent = ctx.parents[ctx.path.indexOf('left') - 1].node
    const leftNode = ctx.parents[ctx.path.indexOf('left')].node.left
    const rightNode = ctx.parents[ctx.path.indexOf('left')].node.right

    if (rightNode.type === 'ObjectExpression' && rightNode.properties.length) {
      return rightNode.properties.forEach(exportsProperty => {
        push({
          cjsExports_id: exportsProperty.key.name,
          file_id: ctx.getFileName(),
        })
      })
    }
    // module.exports.foo = bar
    const isNamedModuleExports =
      looksLikeModule(leftNode) &&
      leftNode.object.property &&
      leftNode.object.property.name === 'exports' &&
      leftNode.property
    // exports.foo = bar
    const isNamedExport =
      leftNode.type === 'MemberExpression' &&
      leftNode.object &&
      leftNode.object.name === 'exports' &&
      leftNode.property

    const cjsExports_id =
      isNamedModuleExports || isNamedExport ? leftNode.property.name : 'default'
    const file_id = ctx.getFileName()

    push({
      cjsExports_id,
      file_id,
    })
  })
  function looksLikeModule(node) {
    return (
      node.type === 'MemberExpression' &&
      node.object &&
      node.object.object &&
      node.object.object.name &&
      node.object.object.name === 'module' &&
      node.object.property
    )
  }
  function looksLikeExports(node) {
    return (
      node.type === 'MemberExpression' &&
      node.property &&
      node.property.name === 'exports'
    )
  }
  function validate(ctx) {
    // abort if not common.js
    if (ctx.node.name !== 'exports') return false
    // abort if not an assignment
    if (!ctx.path.includes('left')) return false

    const parent = ctx.parents[ctx.path.indexOf('left') - 1].node
    const leftNode = ctx.parents[ctx.path.indexOf('left')].node.left

    if (
      parent.type === 'ArrowFunctionExpression' ||
      parent.type === 'FunctionExpression' ||
      parent.type === 'FunctionDeclaration'
    ) {
      return false
    }

    if (
      looksLikeModule(leftNode) &&
      leftNode.object &&
      leftNode.object.property &&
      leftNode.object.property.name !== 'exports'
    ) {
      return false
    }
    if (
      leftNode.object &&
      leftNode.object.object &&
      leftNode.object.object.name !== 'module'
    ) {
      return false
    }
    if (
      leftNode.object &&
      leftNode.object.name &&
      leftNode.object.name !== 'module' &&
      leftNode.object.name !== 'exports'
    ) {
      return false
    }
    return true
  }
}
