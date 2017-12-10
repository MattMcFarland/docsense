import { ESModule } from '../../core-plugins/es-modules';
import { FileModel } from '../../core-plugins/file';
import Query from './Query';

export interface IFileExportsQuery {
  file_id: string;
  exports: ESModule[];
}
const fileExportsQuery = (db: Lowdb): Promise<IFileExportsQuery[]> => {
  const { esModule_collection, file_collection } = db.getState();
  return Promise.resolve(
    file_collection.reduce((acc: IFileExportsQuery[], file: FileModel) => {
      const fileExports = esModule_collection.filter(
        (xp: ESModule) => xp.file_id === file.file_id
      );

      if (fileExports.length) {
        acc.push({
          file_id: file.file_id,
          exports: fileExports,
        });
      }

      return acc;
    }, [])
  );
};

export default new Query<IFileExportsQuery[]>(fileExportsQuery);
