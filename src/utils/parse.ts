import { dedupe, flatten } from './common';
import { processAllGlobPatterns, readFiles } from './file';
import { registerPlugin } from './plugin';

import { IConfig } from '../config';
import { create } from '../db';
import ParseEngine from '../parser/ParseEngine';
import { IPluginRecord } from '../types/Plugin';
import { log } from '../utils/logger';

/**
 * Parse files using config options
 * @param {DocSenseConfig} config options
 * @returns {Promise<Lowdb>} Updated database
 */
export const parseFiles = ({
  config,
  plugins,
}: {
  config: IConfig;
  plugins: IPluginRecord[];
}): Promise<Lowdb> => {
  return processAllGlobPatterns(config.files)
    .then(flatten)
    .then(dedupe)
    .then((filepaths: string[]) =>
      readFiles(filepaths).then((filesData: string[]) => {
        const parser: ParseEngine = new ParseEngine(
          config.parser,
          config.parseOptions
        );
        const db: Lowdb = create(config.out);

        plugins.forEach((plugin: IPluginRecord) =>
          registerPlugin(parser, plugin, db)
        );

        filesData.forEach((data: string, index) => {
          parser.emit('addFile:before', db.getState());
          const filepath: string = filepaths[index];
          log.info('parse', filepath);
          parser.addFile(filepath, data.toString());
          log.log('success', 'parse', filepath);
          parser.emit('addFile:after', db.getState());
        });

        parser.emit('done');
        return db;
      })
    );
};