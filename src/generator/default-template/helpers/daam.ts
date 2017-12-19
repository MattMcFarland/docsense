// Directory as a Module (DAAM)

module.exports = (ctx: string) =>
  ctx
    .split('/')
    .slice(0, -1)
    .pop();
