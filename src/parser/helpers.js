//@flow

export default (pathObj: any) => ({
  getFileName: () => getFileName(pathObj),
  select: (value: string) => select(pathObj, value),
  get: (value: string) => get(pathObj, value),
  getFunctionMeta: () => getFunctionMeta(pathObj),
  getFunctionParams: () => getFunctionParams(pathObj),
  getDocTags: () => getDocTags(pathObj),
  getVariableId: () => getVariableId(pathObj),
})

export const get = (path: any, value: string) => {
  try {
    return path.get(value).node
  } catch (e) {
    return undefined
  }
}
export const select = (path: any, value: string) => {
  try {
    return path.get(value)
  } catch (e) {
    return path
  }
}

export const getFileName = (path: any) =>
  path.node && path.node.loc && path.node.loc.filename

export function getFunctionMeta(path: any) {
  const line = path.get('loc.start.line').node
  const column = path.get('loc.start.column').node
  const id = path.get('id').node
  const location_id = `${line}:${column}`
  const function_id =
    (id ? path.get('id.name').node : 'anonymous') + '@' + location_id
  const params = getFunctionParams(path)
  const jsdoc = getDocTags(path)
  return {
    function_id,
    params: params.length ? params : undefined,
    jsdoc,
  }
}

export const getFunctionParams = (path: any) => {
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

export function getDocTags(path: any) {
  const tags =
    path.node.__doc_tags__ ||
    path.getStatementParent().node.__doc_tags__ ||
    path.parent.__doc_tags__
  return tags && tags.length ? tags : undefined
}

export function getVariableId(path: any) {
  return path.parentPath.isVariableDeclarator()
    ? path.parent.id.name
    : undefined
}
