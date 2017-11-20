// @flow
import './logger'
import getConfig from './config'
import { flatten, dedupe, fatalError, logMap } from './utils/common'
import {
  processAllGlobPatterns,
  resolvePathFromCWD,
  readFiles,
} from './utils/file'

const parseASTs = files => Promise.all(files.map())

const parseFiles = config => {
  const parser = module.require(config.parser)
  const parseOptions = config.parseOptions

  return processAllGlobPatterns(config.files)
    .then(flatten)
    .then(dedupe)
    .then(filepaths =>
      readFiles(filepaths).then(filesData =>
        Promise.all(
          filesData.map((data, index) => {
            const filepath = filepaths[index]
            const fullpath = resolvePathFromCWD(filepath)
            return {
              [filepath]: { ast: parser.parse(data, parseOptions) },
              fullpath,
            }
          })
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
