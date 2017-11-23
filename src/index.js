// @flow
import './logger'
import getConfig from './config'
import {
  flatten,
  dedupe,
  fatalError,
  convertEntriesToObject,
  logContext,
} from './utils/common'
import {
  processAllGlobPatterns,
  resolvePathFromCWD,
  readFiles,
} from './utils/file'
import path from 'path'
import ParseEngine from './parser/ParseEngine'
import fs from 'fs'
import { create } from './db'

/**
 * Parse files using config options
 * @param {DocSenseConfig} config options
 * @returns {Promise<FileRecord[]>} Array of filerecord objects
 */
const parseFiles = ({
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
      readFiles(filepaths).then((filesData: any) => {
        const parser: ParseEngine = new ParseEngine(
          config.parser,
          config.parseOptions
        )
        const db: Lowdb = create(config.out)

        plugins.forEach((plugin: PluginAPI) => {
          plugin.exec(parser, db)
        })

        filesData.forEach((data, index) => {
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

const setupCorePlugins = (
  config: DocSenseConfig
): Promise<{ config: DocSenseConfig, plugins: PluginAPI[] }> => {
  return new Promise((resolve, reject) => {
    fs.readdir(
      path.resolve(__dirname, 'core-plugins'),
      (err, files: string[]) => {
        if (err) return reject(err)
        const plugins: PluginAPI[] = files
          .reduce((acc: string[], name: string) => {
            if (name.indexOf('.js') > -1) acc.push(name)
            return acc
          }, [])
          .map((file: string) => path.join('./core-plugins', file))
          .map((filepath: string): PluginAPI => ({
            id: filepath,
            exec: ((module.require('./' + filepath).default ||
              module.require('./' + filepath): any): DocSensePlugin),
          }))
        return resolve({ config, plugins })
      }
    )
  })
}

getConfig()
  .then(setupCorePlugins)
  .then(parseFiles)
  .catch(fatalError)
