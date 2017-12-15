import { DirectoryModel } from '../../core-plugins/directory';
import { ESModule } from '../../core-plugins/es-modules';
import { FileKind, FileModel } from '../../core-plugins/file';
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
        if (!dir.files) return acc;
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
        if (exportedModules.length) {
          acc.push({
            directory: dir.directory_id,
            exportedModules,
          });
        }
        return acc;
      },
      []
    )
  );
};

export default new Query<IDirectoryExportsQuery[], void>(directoryExportsQuery);
