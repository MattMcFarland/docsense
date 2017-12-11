import { DirectoryModel, FileIdRecord } from '../../core-plugins/directory';
import { ESModule } from '../../core-plugins/es-modules';
import { FileKind, FileModel } from '../../core-plugins/file';
import { decode, encode } from '../../utils/base64';
import Query from './Query';

export interface ObjectTree {
  [key: string]: ObjectTree;
}

const hierarchyQuery = (db: Lowdb): Promise<ObjectTree> => {
  interface Records {
    file_collection: FileModel[];
  }
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
  return Promise.resolve(hierarchy);
};

export default new Query<ObjectTree, void>(hierarchyQuery);
