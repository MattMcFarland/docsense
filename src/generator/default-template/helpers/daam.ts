// Directory as a Module (DAAM)

export default (ctx: string) =>
  ctx
    .split('/')
    .slice(0, -1)
    .pop();
