// @flow
import './logger'
import getConfig from './config'
import { flatten, dedupe, fatalError } from './utils/common'
import {
  processAllGlobPatterns,
  resolvePathFromCWD,
  readFiles,
} from './utils/file'

/**
 * Parse files using config options
 * @param {DocSenseConfig} config options
 * @returns {Promise<FileRecord[]>} Array of filerecord objects
 */
const parseFiles = (config: DocSenseConfig): Promise<FileRecord[]> => {
  const parser = module.require(config.parser)
  const parseOptions = config.parseOptions

  return processAllGlobPatterns(config.files)
    .then(flatten)
    .then(dedupe)
    .then(filepaths =>
      readFiles(filepaths).then(filesData =>
        Promise.all(
          filesData.map((data, index): FileRecord => ({
            relPath: filepaths[index],
            fullPath: resolvePathFromCWD(filepaths[index]),
            ast: parser.parse(data, parseOptions),
          }))
        )
      )
    )
}

getConfig()
  .then(parseFiles)
  .then(asts => {
    console.log(asts)
  })
  .catch(fatalError)
