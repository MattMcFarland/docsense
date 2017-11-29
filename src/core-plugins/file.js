import { getFileName } from '../parser/helpers'

module.exports = function(engine, db) {
  db.set('file_collection', []).write()
  engine.on('addFile', ({ fileName: file_id }) => {
    db
      .get('file_collection')
      .push({ file_id })
      .write()
  })
}
