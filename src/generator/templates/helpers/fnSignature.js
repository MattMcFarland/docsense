const Handlebars = require('handlebars');
const renderParam = require('./renderParam');

module.exports = (fn, jsdoc) => {
  const params = fn.params.map(renderParam);
  const callExpression = `(<span class="dark-red">${params.join(', ')}</span>)`;
  return new Handlebars.SafeString(callExpression);
};
