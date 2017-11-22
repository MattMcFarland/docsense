export default state => {
  state.getFileName = () =>
    state.isRoot ? state.node.loc.filename : state.parents[0].node.loc.filename
  state.getRoot = () => (state.isRoot ? state.node : state.parents[0].node)

  return state
}
