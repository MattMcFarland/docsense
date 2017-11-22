import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'

export const create = outDir => {
  const adapter = new FileSync(path.resolve(outDir, 'db.json'))
  const db = low(adapter)
  return db
}
