export const collectionName = 'file_collection'
export default function(engine, db) {
  db.set(collectionName, []).write()
  engine.on('addFile', ({ fileName: file_id }) => {
    db
      .get(collectionName)
      .push({ file_id })
      .write()
  })
}
