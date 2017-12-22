const Path = require('path');
export default (ctx: any) => {
  const Handlebars = require('handlebars');
  const { tree } = ctx.hash;
  const htmlString = collectionToString(tree);
  return new Handlebars.SafeString(htmlString);
};

let i = 0;

export function collectionToString(
  obj: any,
  list: string = '',
  prefix: string = '<ul>',
  suffix: string = '</ul>',
  x: number = 0,
  z: number = 0,
  path: string = ''
) {
  const maybeListItems = keysReduce(
    obj,
    (build: any, key: string, y: number) => {
      if (key === 'filedata') return build;
      i++;
      const node = obj[key];
      const coordinates = [x, y, z];

      build += makeListItem(node, key, coordinates, path);
      if (hasKeys(obj[key])) {
        const newPath = Path.posix.join(path, key);
        // recursively build another list
        return collectionToString(
          obj[key],
          build,
          `<li><ul data-coordinates="${coordinates}" class="pl3">`,
          '</ul></li>',
          x + 1,
          y + i,
          newPath
        );
      }
      return build;
    }
  );
  if (maybeListItems) list += prefix + maybeListItems + suffix;
  return list;
}

export function makeListItem(
  node: any,
  key: string,
  coordinates: number[],
  path: string
): string {
  // if the node does not have a child called .filedata, then it is strictly
  // a directory
  if (!node.filedata) {
    return makeFolderItem(key, coordinates, path);
  }
  // files that are index.js are DAAMS (Directory As a Module)
  if (node.filedata.name.startsWith('index')) {
    return makeDAAMItem(node.filedata, coordinates);
  }
  // anything else should be a module
  return makeModuleItem({ path: node.filedata.path, name: node.filedata.name });
}

// Just a Directory
export function makeFolderItem(
  key: string,
  coordinates: number[],
  path: string
) {
  const dirPath = path
    ? `/${path}/${key}/directory.html`
    : `/${key}/directory.html`;
  return `
  <li class="pa1 near-white">
    <a data-type="folder" data-toggle="${coordinates}" href="${dirPath}" class="toggler pa1 link dim white db">
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
export function makeDAAMItem({ path }: any, coordinates: number[]) {
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

export function makeModuleItem({ path, name }: any) {
  return `
  <li class="pa1 near-white">
    <a class="pa1 link dim white db" href="/${path}/index.html" title="${path}">
      <span data-slot="icons" class="dib">
        <i>&nbsp;</i>
        <i class="white-40 icon-cube mr2"></i>
      </span>
      <span>${name}</span>
    </a>
  </li>
  `;
}

export function keysReduce<T>(
  obj: { [key: string]: any },
  cb: (
    previousValue: any,
    currentValue: string,
    currentIndex: number,
    array: string[]
  ) => any
) {
  const isIndex = (node: any) =>
    node && node.filedata && node.filedata.name.startsWith('index');
  const alphaSort = (a: string, b: string, w: number) => {
    const sorted = [a, b].sort();
    return sorted.indexOf(a) > sorted.indexOf(b) ? w : -w;
  };
  const filesLast = (keyA: string, keyB: string) => {
    const nodeA = obj[keyA];
    const nodeB = obj[keyB];
    if (!nodeA.filedata && !nodeB.filedata) return alphaSort(nodeA, nodeB, 10);
    if (isIndex(nodeA) && isIndex(nodeB))
      return alphaSort(nodeA.filedata.name, nodeB.filedata.name, 10);
    if (!nodeA.filedata) return -10;
    if (isIndex(nodeA)) return -10;
    if (!nodeB.filedata) return 10;
    if (isIndex(nodeB)) return 10;
    return alphaSort(nodeA, nodeB, 1);
  };
  return Object.keys(obj)
    .sort(filesLast)
    .reduce(cb, '');
}

export function hasKeys(obj: any) {
  return Boolean(obj && Object.keys(obj).length);
}

export function daam(path: string) {
  return path
    .split('/')
    .slice(0, -1)
    .pop();
}
