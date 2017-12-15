// Directory as a Module (DAAM)

module.exports = function(ctx) {
  return ctx
    .split('/')
    .slice(0, -1)
    .pop();
};
