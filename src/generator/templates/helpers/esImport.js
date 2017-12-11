const HighlightJS = require('highlight.js');
const Handlebars = require('handlebars');

module.exports = function(ctx) {
  const { name, link, from, all, line } = ctx.hash;
  const href = line ? link + '#' + line : link;
  const code = block(
    makeImport(name, all),
    makeKeyword('from'),
    makeLink(href, 'view source', `'${from}'`)
  );
  return new Handlebars.SafeString(code);
};

function makeImport(name, all) {
  if (all) {
    return `${makeKeyword('import')} * ${makeKeyword(
      'as'
    )} <span>${name}</span>`;
  }
  return `${makeKeyword('import')} <span>${name}</span>`;
}

function makeString(str) {
  return `<span class="hljs-string">'${str}'</span>`;
}

function makeKeyword(str) {
  return `<span class="hljs-keyword">${str}</span>`;
}

function makeLink(href, title, body) {
  return `<a title="${title}" class="dim dark-red link" href="${href}">${body}</a>`;
}

function block(...strings) {
  return (
    '<pre class="ba b--black-20 lh-solid">' +
    '<code class="javascript hljs">' +
    strings.join(' ') +
    '</code></pre>'
  );
}
