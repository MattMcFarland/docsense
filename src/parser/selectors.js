//@flow
import { path } from 'ramda'

const dotget = (dotpath: string): any => path(dotpath.split('.'))

/**
 * A higher order function that applies selectors to the traversed context
 * to make it easier to find things
 */
export default (ctx: any): any => {
  const node = ctx.node
  ctx.getFileName = () => dotget('loc.filename')(node)
  ctx.getRoot = () => (ctx.isRoot ? node : dotget('parents.0.node')(node))
  ctx.getDeclarations = () => dotget('declaration.declarations')(node)
  ctx.get = dotpath => dotget(dotpath)(node)
  return ctx
}
