import getConfig from './config'
import { fatalError, logContext } from './utils/common'
import { setupCorePlugins } from './utils/plugin'
import { parseFiles } from './utils/parse'
import { init as initializeLogger } from './utils/logger'

initializeLogger()

getConfig()
  .then(setupCorePlugins)
  .then(parseFiles)
  .then(buildDatabase)
  .then(logContext)
  .catch(fatalError)

function buildDatabase(db) {
  const { file_collection, export_collection } = db.getState()
  const filesWithExports = file_collection.reduce((acc, file) => {
    const fileExports = export_collection.filter(
      xp => xp.file_id == file.file_id
    )
    acc.push({
      file_id: file.file_id,
      exports: fileExports.map(x => x.export_id),
    })
    return acc
  }, [])
  return filesWithExports
}
