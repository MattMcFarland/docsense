import * as Path from 'path';
import * as traverse from 'traverse';

import { Traverse, TraverseContext } from '../../_types/external/traverse';
import { ESModule } from '../../core-plugins/es-modules';
import { FileKind, FileModel } from '../../core-plugins/file';
import { decode, encode } from '../../utils/base64';
import Query from './Query';

export interface ObjectTree {
  [key: string]: ObjectTree;
}
interface Records {
  file_collection: FileModel[];
}

const hierarchyQuery = (db: Lowdb): Promise<Traverse<ObjectTree>> => {
  const { file_collection }: Records = db.getState();
  const treeInject = (obj: ObjectTree, path: string[]): void => {
    if (path.length === 0) return;
    const key = path[0];
    if (!(key in obj)) obj[key] = {};
    return treeInject(obj[key], path.slice(1));
  };
  const hierarchy: ObjectTree = {};
  file_collection.forEach(file => {
    treeInject(hierarchy, file.path.split('/'));
  });

  const tree = traverse(hierarchy);
  // tslint:disable-next-line:only-arrow-functions
  tree.forEach(function(value: ObjectTree) {
    // tslint:disable-next-line:no-this-assignment

    if (this.isLeaf) {
      const fullpath = this.path.join('/');
      const { dir, name } = Path.parse(fullpath);
      const filepath = `${dir}/${name}`;
      const file_id = encode(filepath);
      const filedata = file_collection.find(f => f.id === file_id);
      this.node = filedata;
    }
  });

  return Promise.resolve(tree);
};

export default new Query<Traverse<ObjectTree>, void>(hierarchyQuery);
