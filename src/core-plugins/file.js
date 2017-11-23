module.exports = function(engine, db) {
  db.set('file_collection', []).write()
  engine.on('File', (state, value) => {
    db
      .get('file_collection')
      .push({ file_id: state.getFileName() })
      .write()
  })
}
