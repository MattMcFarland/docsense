import * as Path from 'path';
import * as traverse from 'traverse';

import { FileKind, FileModel } from '../../_types/File';

import { ESModule } from '../../core-plugins/es-modules';
import { decode, encode } from '../../utils/base64';
import Query from './Query';

export interface ObjectTree {
  [key: string]: ObjectTree;
}
interface Records {
  manual_file_collection: FileModel[];
  manual_data_collection: ManualData[];
}

interface ManualData {
  id: string;
  source: string;
}

interface ManualRecord {
  id: string;
  fileData: FileModel;
  source: string;
}

const manualQuery = (db: Lowdb): Promise<ObjectTree> => {
  const {
    manual_file_collection,
    manual_data_collection,
  }: Records = db.getState();

  if (!Array.isArray(manual_file_collection)) {
    return Promise.resolve({});
  }
  const filesOfConcern = manual_file_collection.reduce(
    (acc: ManualRecord[], file: FileModel) => {
      // Add constraints here, like as we add more core-plugins, we can
      // ask it to also check for other filters
      const withSource = manual_data_collection.filter(
        (man: ManualData) => man.id === file.id
      );

      if (withSource.length) {
        acc.push({
          id: file.id,
          fileData: file,
          source: withSource[0].source,
        });
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
    treeInject(hierarchy, file.fileData.path.split('/'));
  });

  const tree = traverse(hierarchy);
  tree.forEach(function(value: ObjectTree) {
    const childKeys = Object.keys(value);
    const maybeIndex = childKeys.find(childKey => {
      return childKey.startsWith('index.');
    });
    if (!this.node.type) {
      this.node.type = 'path';
    }
    if (maybeIndex) {
      const filedata = maybeFileData(this.path.join('/') + `/${maybeIndex}`);
      if (filedata) {
        this.node.meta = filedata;
      }
    }
    if (this.isLeaf) {
      const filedata =
        this.key &&
        !this.key.startsWith('index.') &&
        maybeFileData(this.path.join('/'));
      if (filedata) {
        this.node.meta = filedata;
        this.node.type = 'file';
      } else {
        this.delete(false);
      }
    }
    if (this.level === 1) {
      this.node.type = 'root';
    }
  });
  function maybeFileData(fullpath: string) {
    const { dir, name } = Path.parse(fullpath);
    const filepath = `${dir}/${name}`;
    const file_id = encode(filepath);
    const filedata = filesOfConcern.find(f => f.id === file_id);
    return filedata;
  }

  if (Object.keys(tree.nodes()[0]).length === 0) {
    return Promise.resolve(tree.clone());
  }

  return Promise.resolve(tree.clone());
};

export default new Query<ObjectTree, void>(manualQuery);
