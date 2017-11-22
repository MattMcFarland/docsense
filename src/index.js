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
}): Promise<any> => {
  if (config.packages) {
    console.log('packages are not yet supported')
    process.exit(1)
  }
  return processAllGlobPatterns(config.files)
    .then(flatten)
    .then(dedupe)
    .then(filepaths =>
      readFiles(filepaths).then(filesData => {
        const parser = new ParseEngine(config.parser, config.parseOptions)
        const db = create(config.out)

        plugins.forEach((plugin: DocSensePlugin) => {
          plugin.exec(parser, db)
        })

        filesData.forEach((data, index) => {
          log.info('parse', filepaths[index])
          parser.addFile(filepaths[index], data.toString())
          log.log('success', 'parse', filepaths[index])
        })

        parser.emit('done')
        return db
      })
    )
}

const setupCorePlugins = (config: DocSenseConfig): Promise<any> => {
  return new Promise((resolve, reject) => {
    fs.readdir(path.resolve(__dirname, 'core-plugins'), (err, files) => {
      if (err) return reject(err)
      const plugins = files
        .map(file => path.join('./core-plugins', file))
        .map(filepath => ({
          id: filepath,
          exec:
            module.require('./' + filepath).default ||
            module.require('./' + filepath),
        }))
      return resolve({ config, plugins })
    })
  })
}

const reconcileStores = stores => {
  return convertEntriesToObject(Array.of(...stores))
}

getConfig()
  .then(setupCorePlugins)
  .then(parseFiles)
  .catch(fatalError)
