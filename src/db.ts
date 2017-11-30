// @flow

import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import lowdb from 'lowdb'

export const create = (outDir: string): Lowdb => {
  const adapter: any = new FileSync(path.resolve(outDir, 'db.json'))
  const db: Lowdb = low(adapter)
  return db
}
