const traverse = require('traverse');

module.exports = (context, options) => {
  let result = '';
  traverse.forEach(context, function(value) {
    result += options.fn(this);
  });
  return result;
};
