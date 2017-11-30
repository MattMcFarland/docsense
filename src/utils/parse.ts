import { flatten, dedupe } from './common'
import { processAllGlobPatterns, readFiles } from './file'
import { registerPlugin } from './plugin'

import ParseEngine from '../parser/ParseEngine'
import { create } from '../db'
import { IConfig } from 'src/config'
import * as Plugin from 'src/types/Plugin'

const log = global.log

/**
 * Parse files using config options
 * @param {DocSenseConfig} config options
 */
export const parseFiles = ({
  config,
  plugins,
}: {
  config: IConfig;
  plugins: Plugin.Record[];
}): Promise<Lowdb> => {
  return processAllGlobPatterns(config.files)
    .then(flatten)
    .then(dedupe)
    .then((filepaths: string[]) =>
      readFiles(filepaths).then((filesData: string[]) => {
        const parser: ParseEngine = new ParseEngine(
          config.parser,
          config.parseOptions
        )
        const db: Lowdb = create(config.out)

        plugins.forEach((plugin: Plugin.Record) =>
          registerPlugin(parser, plugin, db)
        )

        filesData.forEach((data: string, index) => {
          parser.emit('addFile:before', db.getState())
          const filepath: string = filepaths[index]
          log.info('parse', filepath)
          parser.addFile(filepath, data.toString())
          log.log('success', 'parse', filepath)
          parser.emit('addFile:after', db.getState())
        })

        parser.emit('done')
        return db
      })
    )
}
