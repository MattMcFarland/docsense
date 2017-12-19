import { DocSenseConfig } from '../config';
import { create, Lowdb } from '../storage/db';
import { dedupe, flatten } from '../utils/common';
import { processAllGlobPatterns, readFiles } from '../utils/file';
import { log } from '../utils/logger';
import ParseEngine from './ParseEngine';
import { IPluginRecord, registerPlugin } from './plugin-loader';

/**
 * Parse files using config options
 * @param {DocSenseConfig} config options
 * @returns {Promise<Lowdb>} Updated database
 */
export const parseFiles = ({
  config,
  plugins,
}: {
  config: DocSenseConfig;
  plugins: IPluginRecord[];
}): Promise<Lowdb> => {
  return processAllGlobPatterns(config.files)
    .then(flatten)
    .then(dedupe)
    .then((filepaths: string[]) =>
      readFiles(filepaths).then((filesData: string[]) => {
        const parser: ParseEngine = new ParseEngine(config);
        const db: Lowdb = create(config.out || '');
        log.info('plugin', 'registering plugins');
        plugins.forEach((plugin: IPluginRecord) =>
          registerPlugin(parser, plugin, db)
        );
        log.info('plugin', 'plugins registered');
        log.info('parse', 'start');
        filesData.forEach((data: string, index) => {
          parser.emit('addFile:before', db.getState());
          const filepath: string = filepaths[index];
          log.silly('add', filepath);
          parser.addFile(filepath, data.toString());
          log.verbose('parse', filepath);
          parser.emit('addFile:after', db.getState());
        });
        log.info('parse', 'complete');
        parser.emit('done');
        return db;
      })
    );
};
