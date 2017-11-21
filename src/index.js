// @flow
import './logger'
import getConfig from './config'
import { flatten, dedupe, fatalError } from './utils/common'
import {
  processAllGlobPatterns,
  resolvePathFromCWD,
  readFiles,
} from './utils/file'
import Parser from './parser'

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
        // TODO: Create some interface for dealing with this emitter, probably
        // should be passed in via promise chain.
        // e.g. an array of plugins with instructions to subscribe could be passed in
        parser.on('VariableDeclaration', node =>
          console.log(
            'VariableDeclaration',
            node.kind,
            node.declarations[0].id.name,
            '..SEE TODO COMMENT..'
          )
        )
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
