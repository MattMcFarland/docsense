import { existsSync, writeFileSync } from 'fs';
import * as Path from 'path';

import { log } from '../../utils/logger';

export const command = 'init [Options]';
export const desc = 'Initializes docsense config file (.docsenserc)';
export const aliases = ['i'];
export const builder = {
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
