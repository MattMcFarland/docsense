import * as Path from 'path';

const pkg = require(Path.resolve(process.cwd(), 'package.json'));

export default (ctx: any) => {
  const Handlebars = require('handlebars');
  const { name, link, from, all, line } = ctx.hash;

  const fromProject = Path.posix.join(pkg.name, from || '');

  const href = line ? link + '#' + line : link;
  const code = block(
    makeImport(name, all),
    makeKeyword('from'),
    makeLink(href, 'view source', `'${fromProject}'`)
  );
  return new Handlebars.SafeString(code);
};

function makeImport(name: string, all: string) {
  if (all) {
    return `${makeKeyword('import')} * ${makeKeyword(
      'as'
    )} <span>${name}</span>`;
  }
  return `${makeKeyword('import')} <span>${name}</span>`;
}

function makeString(str: string) {
  return `<span class="hljs-string">'${str}'</span>`;
}

function makeKeyword(str: string) {
  return `<span class="hljs-keyword">${str}</span>`;
}

function makeLink(href: string, title: string, body: string) {
  return `<a title="${title}" class="dim dark-red link" href="${href}">${body}</a>`;
}

function block(...strings: string[]) {
  return (
    '<pre class="ba b--black-20 lh-solid">' +
    '<code class="javascript hljs">' +
    strings.join(' ') +
    '</code></pre>'
  );
}
