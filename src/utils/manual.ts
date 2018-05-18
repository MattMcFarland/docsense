import * as Path from 'path';

import { FileKind, FileModel } from '../_types/File';
import getConfig from '../config';
import { encode } from './base64';
import { dedupe, flatten } from './common';
import { processGlobPattern, readFiles } from './file';

export const addMarkdownFiles = async (db: Lowdb): Promise<Lowdb> => {
  const collectionName = 'manual_collection';
  const config = await getConfig();

  if (!config.manual) return db;

  return processGlobPattern(config.manual)
    .then(flatten)
    .then(dedupe)
    .then((filepaths: string[]) => {
      readFiles(filepaths).then((filesData: string[]) => {
        db.set(collectionName, []).write();
        filepaths.forEach(filepath => {
          const fileModel = createFileModel(filepath);
          db
            .get(collectionName)
            .push(fileModel)
            .write();
        });
      });
    })
    .then(() => db);

  function createFileModel(filepath: string): FileModel {
    const normalizedPath = Path.posix.normalize(filepath);
    const path = Path.posix.relative(config.root, normalizedPath);
    const { dir, base, name, ext } = Path.posix.parse(path);
    const id = encode(`${dir}/${name}`);
    const isIndex = name === 'index';
    return {
      dir,
      base,
      name,
      ext,
      id,
      path,
      isIndex,
      kind: FileKind.Markdown,
    };
  }
};
