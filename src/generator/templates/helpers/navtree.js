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
  x = 0,
  z = 0
) {
  const maybeListItems = keysReduce(obj, (build, key, y) => {
    if (key === 'filedata') return build;

    const node = obj[key];

    const coordinates = [x, y, z];

    build += makeListItem(node, key, coordinates);

    if (hasKeys(obj[key])) {
      // recursively build another list
      return collectionToString(
        obj[key],
        build,
        `<li><ul data-coordinates="${coordinates}" class="pl3">`,
        '</ul></li>',
        x + 1,
        y
      );
    }
    return build;
  });
  if (maybeListItems) list += prefix + maybeListItems + suffix;
  return list;
}

function makeListItem(node, key, coordinates) {
  // if the node does not have a child called .filedata, then it is strictly
  // a directory
  if (!node.filedata) {
    return makeFolderItem(key, coordinates);
  }
  // files that are index.js are DAAMS (Directory As a Module)
  if (node.filedata.name.startsWith('index')) {
    return makeDAAMItem(node.filedata, coordinates);
  }
  // anything else should be a module
  return makeModuleItem(node.filedata, coordinates);
}

// Just a Directory
function makeFolderItem(key, coordinates) {
  return `
  <li class="pa1 near-white">
    <a data-type="folder" data-toggle="${coordinates}" href="#" class="toggler pa1 link dim white db">
      <span data-slot="icons">
        <i class="white-40 icon-caret-down"></i>
        <i class="white-40 icon-folder-open mr2"></i>
      </span>
      <span>${key}</span>
    </a>
  </li>
  `;
}

// Make Directory As a Module
function makeDAAMItem({ path }, coordinates) {
  return `
  <li class="pa1 near-white">
    <a data-type="daam" data-toggle="${coordinates}" class="toggler pa1 link dim white db" href="/${path}/index.html" title="${path}">
      <span data-slot="icons">
        <i class="white-40 icon-caret-down"></i>
        <i class="white-40 icon-cubes mr2"></i>
      </span>
      <span>${daam(path)}</span>
    </a>
  </li>
  `;
}

function makeModuleItem({ path, name }) {
  return `
  <li class="pa1 near-white">
    <a class="pa1 link dim white db" href="/${path}/index.html" title="${path}">
      <span data-slot="icons">
        <i class="white-40 icon-cube mr2"></i>
      </span>
      <span>${name}</span>
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
