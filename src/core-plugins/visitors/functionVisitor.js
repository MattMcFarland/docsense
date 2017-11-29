export default handler => ({
  ArrowFunctionExpression: handler,
  FunctionExpression: handler,
  FunctionDeclaration: handler,
})

export function getFunctionMeta(path, state) {
  const line = path.get('loc.start.line').node
  const column = path.get('loc.start.column').node
  const id = path.get('id').node
  const location_id = `${line}:${column}`
  const function_id =
    (id ? path.get('id.name').node : 'anonymous') + '@' + location_id
  const params = getParams(path)
  const jsdoc = getDocTags(path)
  return {
    function_id,
    params: params.length ? params : undefined,
    jsdoc,
  }
}
export function getParams(path) {
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
export function getDocTags(path) {
  return path.getStatementParent().node.__doc_tags__ || path.parent.__doc_tags__
}
