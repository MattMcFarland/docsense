import * as assert from 'assert';
import * as logger from 'npmlog';
import * as pkg from '../../package.json';

let initialized = false;

export const init = () => {
  assert(!initialized, 'logger already initialized');
  logger.heading = 'docsense';
  logger.info('using', `docsense@${pkg.version}`);
  logger.addLevel('success', 2000, { fg: 'green', bold: true });
  initialized = true;
};

export const log = logger;
