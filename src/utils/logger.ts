const assert = require('assert');
const logger = require('npmlog');

let initialized = false;

export enum LogLevel {
  silly = 'silly',
  info = 'info',
  verbose = 'verbose',
}
export const init = (level: LogLevel) => {
  assert(!initialized, 'logger already initialized');
  try {
    logger.level = level;
    const info = require('../../info.json');
    logger.heading = info.name;
    logger.info('using', `${info.name}@${info.version}`);
    logger.verbose('using', `sha:${info.sha}, built on ${info.date}`);
    logger.verbose('about', `Copyright (c) 2017 - ${info.author}`);
    logger.verbose('about', `${info.license} License`);
    logger.addLevel('success', 2000, { fg: 'green', bold: true });
    initialized = true;
  } catch (e) {
    logger.warn(e.message);
  }
};

export const log = logger;
