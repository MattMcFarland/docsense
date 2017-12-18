#!/usr/bin/env node

import { inspect } from 'util';
import * as yargs from 'yargs';

import getConfig from '../config';
import { fatalError } from '../utils/common';
import { init as initializeLogger, log, LogLevel } from '../utils/logger';

process.on('unhandledRejection', fatalError);
process.on('uncaughtException', fatalError);

/**
 * Command line interface
 * @returns void
 */
getConfig()
  .then(config => {
    require('yargonaut')
      .style('blue')
      .style('yellow', 'required')
      .helpStyle('green.underline')
      .errorsStyle('red.bold');
    const args = yargs
      .usage('$0 <command> [Options]')

      .example(
        '$0 init',
        'Creates a config file for your project (recommended)'
      )
      .example('$0 init --help', 'See options and examples for using init')
      .example('$0 build --help', 'See options and examples for using build')
      .example('$0 serve --help', 'See options and examples for using serve')

      .config(config)

      .option('silent', {
        alias: 's',
        describe: 'Run silently, logging nothing',
        default: false,
        conflicts: ['quiet', 'verbose', 'debug'],
      })
      .option('quiet', {
        alias: 'q',
        describe: 'Run quietly, logging only warnings',
        default: false,
        conflicts: ['silent', 'verbose', 'debug'],
      })
      .option('verbose', {
        alias: 'V',
        describe: 'enables verbose logging',
        default: false,
        conflicts: ['silent', 'quiet', 'debug'],
      })
      .option('debug', {
        alias: 'D',
        describe: 'logs all debug messages, more verbose than verbose.',
        default: false,
        conflicts: ['silent', 'quiet', 'verbose'],
      })

      .alias('v', 'version')
      .alias('h', 'help')

      .commandDir('commands')
      .demandCommand()

      .conflicts('silent', ['quiet, verbose, debug'])
      .epilogue('Thank you for using docsense')
      .help().argv;

    let level = LogLevel.info;

    if (args.silent) level = LogLevel.silent;
    if (args.quiet) level = LogLevel.warn;
    if (args.verbose) level = LogLevel.verbose;
    if (args.debug) level = LogLevel.silly;

    initializeLogger(level);

    log.verbose('config', inspect(args, false, 9, true));

    return args;
  })
  .catch(fatalError);
