import { resolve } from 'path';

export const create = (outDir: string): Lowdb => {
  const low = require('lowdb');
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter: any = new FileSync(resolve(outDir, 'db.json'));
  const db = new low(adapter);
  const foo = 'bar';
  return db;
};
