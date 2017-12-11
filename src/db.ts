import { resolve as resolvePath } from 'path';

import getConfig from './config';
import { DocSenseConfig } from './config/default-config';

// tslint:disable-next-line:no-import-side-effect
import './_types/global/Globals';
/**
 * @deprecated use connect fn instead.
 * Gets or creates a database file with lowdb
 * @param outDir where the database file should be locaed
 * @returns {Lowdb} lowdb instance
 */
export const create = (outDir: string): Lowdb => {
  const low = require('lowdb');
  const FileSync = require('lowdb/adapters/FileSync');
  const adapter: any = new FileSync(resolvePath(outDir, 'db.json'));
  const db = new low(adapter);
  return db;
};

/**
 * Creates or connects to the local database located in the folder dictated by
 * the config.
 * @returns {Promise<Lowdb>} lowdb instance
 */
export const connect = (): Promise<Lowdb> =>
  getConfig().then(config => {
    return create(config.out);
  });
