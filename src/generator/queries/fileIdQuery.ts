import { ESModule } from '../../parser/core-plugins/es-modules';
import { FileKind, FileModel } from '../../parser/core-plugins/file';
import { Lowdb } from '../../storage/db';
import Query from './Query';

const fileQuery = (db: Lowdb, id: string): Promise<FileModel> => {
  const { file_collection } = db.getState();
  return Promise.resolve(file_collection.find({ id }));
};

export default new Query<FileModel, string>(fileQuery);
