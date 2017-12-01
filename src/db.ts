import { resolve } from 'path';

export const create = (outDir: string): Lowdb => {
  const FileSync = require('lowdb/adapters/FileSync');
  const low: any = require('lowdb');
  const adapter: any = new FileSync(resolve(outDir, 'db.json'));
  const db: Lowdb = low(adapter);

  return db;
};
