import { ESModule } from '../../parser/core-plugins/es-modules';
import { FileKind, FileModel } from '../../parser/core-plugins/file';
import { Lowdb } from '../../storage/db';
import Query from './Query';

export interface IFileExportsQuery {
  exports: ESModuleQuery[];
  file: FileModel;
}
export interface IESModuleQuery {
  sourceModule?: ESModule;
}
export type ESModuleQuery = ESModule & IESModuleQuery;

const fileExportsQuery = (db: Lowdb): Promise<IFileExportsQuery[]> => {
  const { esModule_collection, file_collection } = db.getState();
  return Promise.resolve(
    file_collection.reduce((acc: IFileExportsQuery[], file: FileModel) => {
      const fileExports = esModule_collection.filter(
        (xp: ESModule) => xp.file_id === file.id
      );
      const exports: ESModuleQuery[] = fileExports.map(
        (xp: ESModule): ESModuleQuery => {
          switch (xp.kind) {
            case 'ExportingImport':
              const sourceModule = esModule_collection.find(
                (cursor: ESModule) => {
                  return (
                    cursor.esModule_id === xp.source.esModule_id &&
                    cursor.file_id === xp.source.file_id
                  );
                }
              );
              return {
                sourceModule,
                ...xp,
              };
            case 'ExportingFunction':
            case 'ExportingLiteral':
            case 'ExportingReference':
              return xp;
          }
        }
      );
      if (exports.length) {
        acc.push({
          exports,
          file,
        });
      }

      return acc;
    }, [])
  );
};

export default new Query<IFileExportsQuery[], void>(fileExportsQuery);
