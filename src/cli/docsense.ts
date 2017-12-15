#!/usr/bin/env node
import * as yargs from 'yargs';

import getConfig from '../config';
import { init as initializeLogger, log } from '../utils/logger';

initializeLogger();

/**
 * Command line interface
 * @returns void
 */
getConfig()
  .then(
    config =>
      yargs
        .commandDir('commands')
        .alias('v', 'version')
        .alias('h', 'help')
        .demandCommand()
        .config(config)
        .help().argv
  )
  .catch();
