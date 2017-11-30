import logger from 'npmlog';
import pkg from '../package.json';
import assert from 'assert';

let initialized = false;

export const init = () => {
  assert(!initialized, 'logger already initialized');
  logger.heading = 'docsense';
  logger.info('using', `docsense@${pkg.version}`);
  logger.addLevel('success', 2000, { fg: 'green', bold: true });
  initialized = true;
};

export const log = logger;
