export default state => {
  state.getFileName = () => state.node.loc.filename
  state.getRoot = () => (state.isRoot ? state.node : state.parents[0].node)

  return state
}
