#!/usr/bin/env node

import { inspect } from 'util';
import * as yargs from 'yargs';

import getConfig from '../config';
import { fatalError } from '../utils/common';
import { init as initializeLogger, log } from '../utils/logger';

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
        describe:
          'Run silently, logging nothing, shorthand for --loglevel=silent',
        default: false,
      })
      .option('loglevel', {
        describe: 'Set the loglevel',
        alias: 'll',
        choices: ['silent', 'info', 'verbose', 'silly', 'warn'],
        default: 'info',
      })
      .commandDir('commands')
      .demandCommand()
      .epilogue('Thank you for using docsense')
      .help().argv;

    const level = args.silent ? 'silent' : args.loglevel;

    initializeLogger(level);

    log.verbose('config', inspect(args, false, 9, true));

    return args;
  })
  .catch(fatalError);
