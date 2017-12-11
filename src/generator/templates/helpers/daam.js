// Directory as a Module (DAAM)
const camelCase = require('camelcase');
module.exports = function(ctx) {
  return camelCase(
    ctx
      .split('/')
      .slice(0, -1)
      .pop()
  );
};
