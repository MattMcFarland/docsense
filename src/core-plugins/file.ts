import * as Path from 'path';

import ParseEngine from '../parser/ParseEngine';

export const collectionName = 'file_collection';

export interface FileModel {
  file_id: string;
}

export default function(engine: ParseEngine, db: Lowdb) {
  db.set(collectionName, []).write();
  engine.on('addFile', ({ fileName }) => {
    const { dir, name } = Path.parse(fileName);
    const file_id = `${dir}/${name}`;
    db
      .get(collectionName)
      .push({ file_id })
      .write();
  });
}
