import { ESModule } from '../../core-plugins/es-modules';
import { FileKind, FileModel } from '../../core-plugins/file';
import explode from '../../utils/explode';
import Query from './Query';

const fileExportsQuery = (db: Lowdb): Promise<any[]> => {
  const { directory_collection, file_collection } = db.getState();
  return Promise.resolve(explode(directory_collection));
};

export default new Query<any[], void>(fileExportsQuery);
