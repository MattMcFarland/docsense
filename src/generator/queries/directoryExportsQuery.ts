import { DirectoryModel } from '../../parser/core-plugins/directory';
import { ESModule } from '../../parser/core-plugins/es-modules';
import { FileKind, FileModel } from '../../parser/core-plugins/file';
import { Lowdb } from '../../storage/db';
import Query from './Query';

export interface FileIdRecord {
  file_id: string;
}
export interface IDirectoryExportsQuery {
  directory: string;
  exportedModules: IDirectoryExportedModules[];
}
export interface IDirectoryExportedModules {
  file: FileModel;
  fileExports: ESModule[];
}
const directoryExportsQuery = (
  db: Lowdb
): Promise<IDirectoryExportsQuery[]> => {
  const {
    directory_collection,
    file_collection,
    esModule_collection,
  } = db.getState();

  return Promise.resolve(
    directory_collection.reduce(
      (acc: IDirectoryExportsQuery[], dir: DirectoryModel) => {
        const exportedModules = dir.files.reduce(
          (files: IDirectoryExportedModules[], file: FileIdRecord) => {
            const exportedModulesPerFile = esModule_collection.filter(
              (xp: ESModule) => xp.file_id === file.file_id
            );
            if (exportedModulesPerFile.length) {
              files.push({
                file: file_collection.find(
                  (f: FileModel) => f.id === file.file_id
                ),
                fileExports: exportedModulesPerFile,
              });
            }
            return files;
          },
          []
        );
        acc.push({
          directory: dir.directory_id,
          exportedModules,
        });
        return acc;
      },
      []
    )
  );
};

export default new Query<IDirectoryExportsQuery[], void>(directoryExportsQuery);
