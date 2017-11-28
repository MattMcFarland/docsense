//@flow

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

export default (pathObj: any) => ({
  getFileName: () => getFileName(pathObj),
  select: (value: string) => select(pathObj, value),
  get: (value: string) => get(pathObj, value),
})
