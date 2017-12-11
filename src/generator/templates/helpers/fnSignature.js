const Handlebars = require('handlebars');
const renderParam = require('./renderParam');
// {{~#each function.params as |param|~}}
// <span class="dark-red">
//   {{~#if @last~}}{{~renderParam param~}}{{else}}{{~renderParam param~}}<span class="black-50">, </span>{{~/if~}}
// </span>
// {{~/each~}})

module.exports = (fn, jsdoc) => {
  const params = fn.params.map(renderParam);
  const callExpression = `(<span class="dark-red">${params.join(', ')}</span>)`;
  return new Handlebars.SafeString(callExpression);
};
