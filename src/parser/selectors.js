//@flow
import { path } from 'ramda'
import traverse from 'traverse'
const dotget = (dotpath: string): any => path(dotpath.split('.'))

/**
 * A higher order function that applies selectors to the traversed context
 * to make it easier to find things
 */
const selectors = (ctx: any, contextSymbol: any): any => {
  const node = ctx.node
  ctx[contextSymbol] = 'ContextSymbol'
  ctx.getFileName = () => dotget('loc.filename')(node)
  ctx.getRoot = () => (ctx.isRoot ? node : dotget('parents.0.node')(node))
  ctx.getDeclarations = () => dotget('declaration.declarations')(node)
  ctx.get = dotpath => dotget(dotpath)(node)
  ctx.select = dotpath => {
    const val = dotget(dotpath)(ctx)
    if (val[contextSymbol]) {
      return selectors(val)
    }
    return val
  }
  ctx.findType = typeSelector => {
    traverse.nodes(ctx.node).reduce((acc, childNode) => {
      if (childNode.type === typeSelector) acc.push(childNode)
      return acc
    }, [])
  }
  ctx.closest = typeSelector => {
    ctx.pathByType.forEach(parent => {
      if (parent.node && parent.node.type === typeSelector) {
        return selectors(parent)
      }
    })
  }
  return ctx
}

export default selectors
