import ParseEngine from '../parser/ParseEngine';

export const collectionName = 'file_collection';

export interface FileModel {
  file_id: string;
}

export default function(engine: ParseEngine, db: Lowdb) {
  db.set(collectionName, []).write();
  engine.on('addFile', ({ fileName: file_id }) => {
    db
      .get(collectionName)
      .push({ file_id })
      .write();
  });
}
