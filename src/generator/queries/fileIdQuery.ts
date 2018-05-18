import { FileKind, FileModel } from '../../_types/File';
import Query from './Query';

const fileQuery = (db: Lowdb, id: string): Promise<FileModel> => {
  const { file_collection } = db.getState();
  return Promise.resolve(file_collection.find({ id }));
};

export default new Query<FileModel, string>(fileQuery);
