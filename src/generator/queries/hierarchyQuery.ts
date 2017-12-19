import * as Path from 'path';
import * as traverse from 'traverse';

import { Traverse, TraverseContext } from '../../_types/external/traverse';
import { ESModule } from '../../parser/core-plugins/es-modules';
import { FileKind, FileModel } from '../../parser/core-plugins/file';
import { Lowdb } from '../../storage/db';
import { decode, encode } from '../../utils/base64';
import Query from './Query';

export interface ObjectTree {
  [key: string]: ObjectTree;
}
interface Records {
  file_collection: FileModel[];
  esModule_collection: ESModule[];
}

const hierarchyQuery = (db: Lowdb): Promise<ObjectTree> => {
  const { file_collection, esModule_collection }: Records = db.getState();

  const filesOfConcern = file_collection.reduce(
    (acc: FileModel[], file: FileModel) => {
      // Add constraints here, like as we add more core-plugins, we can
      // ask it to also check for other filters
      const hasExports = Boolean(
        esModule_collection.filter((xp: ESModule) => xp.file_id === file.id)
          .length
      );

      if (hasExports) {
        acc.push(file);
      }
      return acc;
    },
    []
  );
  const treeInject = (obj: ObjectTree, path: string[]): void => {
    if (path.length === 0) return;
    const key = path[0];
    if (!(key in obj)) obj[key] = {};
    return treeInject(obj[key], path.slice(1));
  };

  const hierarchy: ObjectTree = {};

  filesOfConcern.forEach(file => {
    treeInject(hierarchy, file.path.split('/'));
  });

  const tree = traverse(hierarchy);
  if (Object.keys(tree.nodes()[0]).length === 0) {
    return Promise.resolve(tree.clone());
  }
  // tslint:disable-next-line:only-arrow-functions
  tree.forEach(function(value: ObjectTree) {
    const childKeys = Object.keys(value);
    const maybeIndex = childKeys.find(childKey => {
      return childKey.startsWith('index.');
    });
    if (maybeIndex) {
      const filedata = maybeFileData(this.path.join('/') + `/${maybeIndex}`);
      if (filedata) {
        this.node.filedata = filedata;
      }
    }
    if (this.isLeaf) {
      const filedata =
        this.key &&
        !this.key.startsWith('index.') &&
        maybeFileData(this.path.join('/'));
      if (filedata) {
        this.node.filedata = filedata;
      } else {
        this.delete(false);
      }
    }
  });
  function maybeFileData(fullpath: string) {
    const { dir, name } = Path.parse(fullpath);
    const filepath = `${dir}/${name}`;
    const file_id = encode(filepath);
    const filedata = filesOfConcern.find(f => f.id === file_id);
    return filedata;
  }
  return Promise.resolve(tree.clone());
};

export default new Query<ObjectTree, void>(hierarchyQuery);
