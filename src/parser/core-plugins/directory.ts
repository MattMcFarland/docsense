import { posix as Path } from 'path';

import { Lowdb } from '../../storage/db';
import { encode } from '../../utils/base64';
import ParseEngine from '../ParseEngine';

export const collectionName = 'directory_collection';

export interface DirectoryModel {
  /**
   * Unique Identifier for the directory, which is also its path.
   */
  directory_id: string;
  /**
   * Collection of file ids, indicating what files live in the directory.
   */
  files: [
    {
      file_id: string;
    }
  ];
}

export default function(engine: ParseEngine, db: Lowdb) {
  db.set(collectionName, []).write();
  engine.on('addFile', ({ fileName }) => {
    // get path and file info
    const directories = db.get(collectionName);
    const normalizedPath = Path.normalize(fileName);
    const path = Path.relative(engine.config.root, normalizedPath);
    const { dir: directory_id, name: file } = Path.parse(path);
    const file_id = encode(`${directory_id}/${file}`);

    // retrive the existing directory entry or create a new one
    const isExistingDirectory = Boolean(
      directories.find({ directory_id }).value()
    );

    if (isExistingDirectory) {
      directories
        .find({ directory_id })
        .get('files')
        .push({ file_id })
        .write();
    } else {
      directories.push({ directory_id, files: [{ file_id }] }).write();
    }
  });
}
