// @flow
import './logger'
import getConfig from './config'
import { flatten, dedupe, fatalError } from './utils/common'
import {
  processAllGlobPatterns,
  resolvePathFromCWD,
  readFiles,
} from './utils/file'
import path from 'path'
import Parser from './parser'

const plugins = ['variable-declaration']
  .map(name => path.resolve(__dirname, 'rules', name))
  .map(modulePath => module.require(modulePath))

console.log(plugins)

/**
 * Parse files using config options
 * @param {DocSenseConfig} config options
 * @returns {Promise<FileRecord[]>} Array of filerecord objects
 */
const parseFiles = (config: DocSenseConfig): Promise<FileRecord[]> => {
  return processAllGlobPatterns(config.files)
    .then(flatten)
    .then(dedupe)
    .then(filepaths =>
      readFiles(filepaths).then(filesData => {
        const parser = new Parser(config.parser, config.parseOptions)
        const store = new Map()

        plugins.forEach((plugin: DocSensePlugin) => {
          plugin(parser, store)
        })

        return Promise.all(
          filesData.map((data, index): FileRecord => {
            log.info('parse', filepaths[index])
            const result = {
              relPath: filepaths[index],
              fullPath: resolvePathFromCWD(filepaths[index]),
              ast: parser.parse(data.toString()),
            }
            log.log('success', 'parse', filepaths[index])
            return result
          })
        )
      })
    )
}

getConfig()
  .then(parseFiles)
  .catch(fatalError)
