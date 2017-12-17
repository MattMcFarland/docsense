const HighlightJS = require('highlight.js');
const Handlebars = require('handlebars');
const Path = require('path');
const pkg = require(Path.resolve(process.cwd(), 'package.json'));

module.exports = function(ctx) {
  const { name, link, from, all, line } = ctx.hash;

  const fromRootPath = Path.posix.relative(
    ctx.data.root.config.root,
    from || './'
  );
  const fromProject = Path.posix.join(pkg.name + '/', fromRootPath);
  const href = line ? link + '#' + line : link;
  const code = block(
    makeImport(name, all),
    makeKeyword('from'),
    makeLink(href, 'view source', `'${fromProject}'`)
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
