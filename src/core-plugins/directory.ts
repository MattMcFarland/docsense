import * as Path from 'path';

import ParseEngine from '../parser/ParseEngine';
import { encode } from '../utils/base64';
import { assertNever } from './helpers/getters';

export const collectionName = 'directory_collection';

export default function(engine: ParseEngine, db: Lowdb) {
  db.set(collectionName, []).write();
  engine.on('addFile', ({ fileName }) => {
    const { dir: directory_id, name: file } = Path.posix.parse(fileName);
    const dbEntry = db.get(collectionName).find({ directory_id });
    const file_id = encode(`${directory_id}/${file}`);

    // the path is not in db yet

    if (!dbEntry.value()) {
      db
        .get(collectionName)
        .push({
          directory_id,
          files: [{ file_id }],
        })
        .write();
      return;
    }

    // this path is already in db

    const record = dbEntry.value() as DirectoryModel;
    const newFilesRecord: FileIdRecord[] = [{ file_id }, ...record.files];

    db
      .get(collectionName)
      .find({ directory_id })
      .assign({ files: newFilesRecord })
      .write();
  });
}

export interface DirectoryModel {
  directory_id: string;
  files: FileIdRecord[];
}

export interface FileIdRecord {
  file_id: string;
}
