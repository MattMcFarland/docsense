import { existsSync, writeFileSync } from 'fs';
import * as Path from 'path';
import * as yargs from 'yargs';

import { log } from '../../utils/logger';

export const command = 'init [Options]';
export const desc = 'Initializes docsense config file (.docsenserc)';
export const aliases = ['i'];

export const builder: yargs.CommandBuilder = argv => {
  return yargs
    .options({
      dir: {
        desc: 'directory to add rc file',
        default: '.',
      },
      out: {
        desc: 'where docs will be written when using docsense build',
        default: './docs',
      },
      main: {
        desc: 'main markdown file (without .md extension)',
        default: './README',
      },
      files: {
        desc: 'files to generate documentation on (can be glob patterns)',
        default: ['./'],
      },
    })
    .example(
      'mkdir foo && docsense init --dir foo',
      'puts config file in the foo dir'
    )
    .example('docsense init', 'initializes config with the default settings')
    .example(
      'docsense init --main ./manual.md',
      'Configures docsense to use ./manual.md as the home page'
    )
    .example(
      'docsense init --out ./documentation',
      'Configures docsense to build to "./documentation" by default'
    );
};

export const handler = (argv: any) => {
  const rcPath = Path.join(argv.dir, '.docsenserc');
  if (existsSync(rcPath)) {
    log.error('cli:init', 'Docsense is already initialized');
    process.exit(1);
  }
  const initSettings = {
    out: argv.out,
    main: argv.main,
    files: argv.files,
  };
  const initialSettings = JSON.stringify(initSettings, null, 2);
  writeFileSync(Path.join(argv.dir, '.docsenserc'), initialSettings);
  log.info('cli:init', rcPath + ' created and docsense initialized!');
};
