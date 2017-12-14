const Handlebars = require('handlebars');

module.exports = function(ctx) {
  const { tree } = ctx.hash;
  const htmlString = collectionToString(tree);
  return new Handlebars.SafeString(htmlString);
};

function collectionToString(
  obj,
  list = '',
  prefix = '<ul>',
  suffix = '</ul>',
  depth = 0
) {
  const maybeListItems = keysReduce(obj, (build, key) => {
    if (key === 'filedata') return build;

    const node = obj[key];

    build += makeListItem(node, key);

    if (hasKeys(obj[key])) {
      // recursively build another list
      return collectionToString(
        obj[key],
        build,
        '<li><ul class="pl3">',
        '</ul></li>',
        depth + 1
      );
    }
    return build;
  });
  if (maybeListItems) list += prefix + maybeListItems + suffix;
  return list;
}

function makeListItem(node, key) {
  // if the node does not have a child called .filedata, then it is strictly
  // a directory
  if (!node.filedata) {
    return makeFolderItem(key);
  }
  // files that are index.js are DAAMS (Directory As a Module)
  if (node.filedata.name.startsWith('index')) {
    return makeDAAMItem(node.filedata);
  }
  // anything else should be a module
  return makeModuleItem(node.filedata);
}

// Just a Directory
function makeFolderItem(key) {
  return `
  <li class="pa1 near-white">
    <a href="#" class="pa1 link dim white db">
      <i class="white-40 icon-folder mr2"></i>${key}
    </a>
  </li>
  `;
}

// Make Directory As a Module
function makeDAAMItem({ path }) {
  return `
  <li class="pa1 near-white">
    <a class="pa1 link dim white db" href="/${path}/index.html" title="${path}">
      <i class="white-40 icon-cubes mr2"></i>${daam(path)}
    </a>
  </li>
  `;
}

function makeModuleItem({ path, name }) {
  return `
  <li class="pa1 near-white">
    <a class="pa1 link dim white db" href="/${path}/index.html" title="${path}">
      <i class="white-40 icon-cube mr2"></i>${name}
    </a>
  </li>
  `;
}

function keysReduce(obj, cb) {
  return Object.keys(obj).reduce(cb, '');
}

function hasKeys(obj) {
  return obj && Object.keys(obj).length;
}

function daam(path) {
  return path
    .split('/')
    .slice(0, -1)
    .pop();
}
