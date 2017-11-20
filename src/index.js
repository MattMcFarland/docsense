// @flow

import getConfig from './config'
import { flatten, dedupe, fatalError } from './utils/common'
import {
  processAllGlobPatterns,
  resolveAllFilePathsFromCWD,
  readFiles,
} from './utils/file'

const parseASTs = files => Promise.all(files.map())

const parseFiles = config => {
  const parser = module.require(config.parser)
  const parseOptions = config.parseOptions

  return processAllGlobPatterns(config.files)
    .then(flatten)
    .then(resolveAllFilePathsFromCWD)
    .then(dedupe)
    .then(readFiles)
    .then(filesData => {
      return Promise.all(
        filesData.map(data => {
          return parser.parse(data, parseOptions)
        })
      )
    })
}

getConfig()
  .then(parseFiles)
  .then(asts => {
    console.log(asts)
  })
  .catch(fatalError)
