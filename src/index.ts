import getConfig from './config';
import { fatalError, logContext } from './utils/common';
import { init as initializeLogger } from './utils/logger';
import { parseFiles } from './utils/parse';
import { setupCorePlugins } from './utils/plugin';

initializeLogger();

getConfig()
  .then(setupCorePlugins)
  .then(parseFiles)
  .then(buildDatabase)
  .then(logContext)
  .catch(fatalError);

function buildDatabase(db: any) {
  const { file_collection, export_collection } = db.getState();
  const filesWithExports = file_collection.reduce((acc: any, file: any) => {
    const fileExports = export_collection.filter(
      (xp: any) => xp.file_id === file.file_id
    );
    acc.push({
      file_id: file.file_id,
      exports: fileExports.map((x: any) => x.export_id),
    });
    return acc;
  }, []);
  return filesWithExports;
}
