import * as Path from 'path';
import { inspect } from 'util';

import { log } from '../utils/logger';
import { createFile } from './file';

type Entry = [string, any];
/**
 * Send a status message while in a promise chain
 * @param {string} msg
 * @returns {Passthrough} - context of the promise chain is unchanged.
 */
export const status = (msg: string) => (context: any): any => {
  log.info('status', msg);
  return context;
};

export const logMap = (prefix: string) => (items: string[]): string[] => {
  items.forEach(item => log.info(prefix, item));
  return items;
};

/**
 * Changes context in promise chain
 * @param {*} newContext next thing in promise chain will focus on this
 */
export const setContext = (newContext: any) => (): Promise<any> =>
  Promise.resolve(newContext);

/**
 * Wipes the context to undefined, useful for controlling flow
 * @returns {void}
 */
export const voidContext = setContext(undefined);

/**
 * Writes the context of a promise chain to the given key as an entry ( [key, context] )
 * @param {string} key
 * @returns {entry}
 */
export const contextAsEntry = (key: string) => (context: any): Entry => [
  key,
  context,
];

/**
 * Converts entries to a POJO
 * @param {entry[]} entries
 * @returns {POJO} converted entries
 */
export const convertEntriesToObject = (entries: Entry[]) =>
  entries.reduce(
    (obj, [key, value]) => Object.defineProperty(obj, key, { value }),
    {}
  );

/**
 * Logs error, exits 1
 * @param {Error} err error object
 * @returns {void}
 */
export const fatalError = (err: Error): void => {
  log.error('fatal', err.message ? err.message : err);
  if (err.stack) {
    log.error('stack', err.stack);
  }
  const logData: Buffer = Buffer.from(JSON.stringify(log.record, null, 2));
  const logFilePath = Path.resolve(process.cwd(), 'docsense-debug.log');
  createFile('docsense-debug.log', logData)
    .then(() => {
      log.error('info', 'for more information see the log file');
      log.error('info', 'located at ' + logFilePath);
      process.exit(1);
    })
    .catch(e => {
      log.error('fatal', 'couldnt create docsense-debug.log');
      log.error(e.message);
      process.exit(1);
    });
};
/**
 * Logs the current context to the console
 * @param {*} context log this
 * @returns {*} context
 */
export const logContext = (context: any): any => {
  log.info('ctx', context);
  return context;
};

/**
 * Removes duplicates from the given array
 * @param {Array} arr dedupe this array
 * @returns {Array} deduped
 */
export const dedupe = (arr: any[]): any[] =>
  arr.reduce((x, y) => (x.includes(y) ? x : [...x, y]), []);

/**
 * Flattens an array that is one level deep.
 * @param {Array} arr flatten this array
 * @returns {Array} deduped
 */
export const flatten = (arr: any[]): any[] => [].concat(...arr);
