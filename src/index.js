// @flow

import getConfig from './config'
import { flatten, dedupe, fatalError } from './utils/common'
import { processAllGlobPatterns } from './utils/file'

const parseASTs = files => Promise.all(files.map())

const parseFiles = config => {
  const parser = module.require(config.parser)
  const parseOptions = config.parseOptions

  return processAllGlobPatterns(config.files)
    .then(flatten)
    .then(dedupe)
    .then(files => {
      return Promise.all(
        files.map(file => {
          return parser.parse(file, parseOptions)
        })
      )
    })
}

getConfig()
  .then(parseFiles)
  .then(asts => {})
  .catch(fatalError)
