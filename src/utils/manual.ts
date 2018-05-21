import * as Path from 'path';

import { FileKind, FileModel } from '../_types/File';
import getConfig from '../config';
import { encode } from './base64';
import { dedupe, flatten } from './common';
import { processGlobPattern, readFiles } from './file';
import { log } from './logger';

export const addMarkdownFiles = async (db: Lowdb): Promise<Lowdb> => {
  const fileCollectionName = 'manual_file_collection';
  const dataCollectionName = 'manual_data_collection';
  const config = await getConfig();

  if (!config.manual) return db;

  return processGlobPattern(config.manual)
    .then(flatten)
    .then(dedupe)
    .then((filepaths: string[]) => {
      return readFiles(filepaths).then((filesData: string[]) => {
        db.set(fileCollectionName, []).write();
        db.set(dataCollectionName, []).write();
        filepaths.forEach((filepath, index) => {
          const fileModel = createFileModel(filepath);
          db
            .get(fileCollectionName)
            .push(fileModel)
            .write();
          db
            .get(dataCollectionName)
            .push({
              id: fileModel.id,
              source: filesData[index],
            })
            .write();
          log.info('manual', fileModel.dir, fileModel.base);
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
