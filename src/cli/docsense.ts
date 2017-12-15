#!/usr/bin/env node

import * as yargs from 'yargs';
import getConfig from '../config';

getConfig()
  .then(
    config =>
      yargs
        .commandDir('commands')
        .demandCommand()
        .config({ settings: config })
        .help().argv
  )
  .catch();
