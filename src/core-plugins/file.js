import { getFileName } from '../parser/helpers'

module.exports = function(engine, db) {
  db.set('file_collection', []).write()
  engine.on('File', (path, value) => {
    db
      .get('file_collection')
      .push({ file_id: getFileName(path) })
      .write()
  })
}
