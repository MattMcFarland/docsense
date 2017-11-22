module.exports = function(engine, db) {
  db.set('files', []).write()
  engine.on('File', (state, value) => {
    db
      .get('files')
      .push({ id: state.getFileName() })
      .write()
  })
}
