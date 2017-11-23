// @flow
import getConfig from '../config'
import { flatten, dedupe } from './common'
import { processAllGlobPatterns, readFiles } from './file'
import { setupCorePlugins } from './plugin'

import ParseEngine from '../parser/ParseEngine'
import { create } from '../db'

/**
 * Parse files using config options
 * @param {DocSenseConfig} config options
 * @returns {Promise<FileRecord[]>} Array of filerecord objects
 */
export const parseFiles = ({
  config,
  plugins,
}: {
  config: DocSenseConfig,
  plugins: DocSensePlugin[],
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

        plugins.forEach((plugin: PluginAPI) => {
          plugin.exec(parser, db)
        })

        filesData.forEach((data: string, index) => {
          const filepath: string = filepaths[index]
          log.info('parse', filepath)
          parser.addFile(filepath, data.toString())
          log.log('success', 'parse', filepath)
        })

        parser.emit('done')
        return db
      })
    )
}
