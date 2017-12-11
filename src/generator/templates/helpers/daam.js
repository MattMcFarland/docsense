// Directory as a Module (DAAM)
const pc = require('pascal-case');
module.exports = function(ctx) {
  return pc(
    ctx
      .split('/')
      .slice(0, -1)
      .pop()
  );
};
