import FileSync from 'lowdb/adapters/FileSync';
import { resolve } from 'path';

export const create = (outDir: string): Lowdb => {
  const low: any = require('lowdb');
  const adapter: any = new FileSync(resolve(outDir, 'db.json'));
  const db: Lowdb = low(adapter);

  return db;
};
