import { ESModule } from '../../core-plugins/es-modules';
import { FileKind, FileModel } from '../../core-plugins/file';
import Query from './Query';

const fileQuery = (db: Lowdb, id: string): Promise<FileModel> => {
  const { file_collection } = db.getState();
  return Promise.resolve(file_collection.find({ id }));
};

export default new Query<FileModel, string>(fileQuery);
