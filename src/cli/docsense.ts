#!/usr/bin/env node
import * as yargs from 'yargs';

import getConfig from '../config';
import { init as initializeLogger, log } from '../utils/logger';
/**
 * Command line interface
 * @returns void
 */
getConfig()
  .then(config => {
    const args = yargs
      .commandDir('commands')
      .option('silent', {
        alias: 's',
        describe: 'run silent',
      })
      .option('loglevel', {
        describe: 'set loglevel',
        choices: ['silent', 'info', 'verbose', 'silly'],
        default: 'info',
      })
      .demandCommand()
      .config(config)
      .help().argv;

    if (args.silent) {
      args.loglevel = 'silent';
    }
    initializeLogger();
    log.info('loglevel', args.loglevel);

    log.level = args.loglevel;

    log.verbose(JSON.stringify(args));
    return args;
  })
  .catch();
