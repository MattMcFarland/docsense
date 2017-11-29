// @flow
import type ParseEngine from '../parser/ParseEngine'
import helpers from '../parser/helpers'

export const collectionName = 'cjsExports_collection'
export default function(engine: ParseEngine, db: Lowdb): void {
  ;(db.set(collectionName, []): Lowdb).write()
  const push = data => {
    db
      .get(collectionName)
      .push(data)
      .write()
  }
  engine.on('Identifier', path => {
    if (!validate(path)) return
    const { getFileName } = helpers(path)

    // the expression
    const assignment = path.findParent(path => path.isAssignmentExpression())

    const parent = path.parent
    const leftNode = assignment.node.left

    const rightNode = assignment.node.right
    if (!parent || !leftNode || !rightNode) {
      return
    }
    if (rightNode.type === 'ObjectExpression' && rightNode.properties.length) {
      return rightNode.properties.forEach(exportsProperty => {
        push({
          cjsExports_id: exportsProperty.key.name,
          file_id: getFileName(),
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
    const file_id = getFileName()

    push({
      cjsExports_id,
      file_id,
    })
  })
  function looksLikeModule(node) {
    if (!node) return
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
  function validate(path) {
    // abort if not common.js
    if (path.node.name !== 'exports') return false
    // abort if module or exports are not found in global scope
    const root = path.findParent(path => path.isProgram())
    if (
      !path.scope.globals.exports &&
      !path.scope.globals.module &&
      !root.scope.globals.module &&
      !root.scope.globals.exports
    ) {
      return
    }
    // abort if not an assignment
    const assignment = path.findParent(path => path.isAssignmentExpression())
    if (!assignment) return false
    const parent = path.parent
    const leftNode = assignment.node.left
    if (!parent || !leftNode) {
      return
    }
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
