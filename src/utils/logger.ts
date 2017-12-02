import assert = require('assert');
import logger = require('npmlog');

let initialized = false;

export const init = () => {
  assert(!initialized, 'logger already initialized');
  const info = require('../info.json');
  logger.heading = info.name;
  logger.info('using', `${info.name}@${info.version}`);
  logger.info('using', `sha:${info.sha}, built on ${info.date}`);
  logger.info('about', `Copyright (c) 2017 - ${info.author}`);
  logger.info('about', `${info.license} License`);
  logger.addLevel('success', 2000, { fg: 'green', bold: true });
  initialized = true;
};

export const log = logger;
