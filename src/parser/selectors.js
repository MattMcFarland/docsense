//@flow
import { path } from 'ramda'
import { TraverseContext } from 'traverse'

const dotget = (dotpath: string): any => path(dotpath.split('.'))
export default (ctx: TraverseContext): any => {
  const node = ctx.node
  ctx.getFileName = () => dotget('loc.filename')(node)
  ctx.getRoot = () => (ctx.isRoot ? node : dotget('parents.0.node')(node))
  ctx.getDeclarations = () => dotget('declaration.declarations')(node)
  ctx.get = dotpath => dotget(dotpath)(node)
  return ctx
}
