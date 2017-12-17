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
      .config(config)
      .option('silent', {
        alias: 's',
        describe:
          'Run silently, logging nothing, shorthand for --loglevel=silent',
        default: false,
      })
      .option('loglevel', {
        describe: 'Set the loglevel',
        alias: 'll',
        choices: ['silent', 'info', 'verbose', 'silly'],
        default: 'info',
      })
      .commandDir('commands')
      .demandCommand()
      .epilogue('Thank you for using docsense')
      .help().argv;

    const level = args.silent ? 'silent' : args.loglevel;

    initializeLogger(level);

    log.verbose(JSON.stringify(args));
    return args;
  })
  .catch();
