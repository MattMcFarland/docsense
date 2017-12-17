import { existsSync, writeFileSync } from 'fs';
import * as Path from 'path';
import * as Sane from 'sane';
import { log } from '../../utils/logger';
import { handler as build } from './build';

export const command = 'serve [Options|files..]';
export const aliases = ['s'];
export const desc = 'Serves up a local docsense app that watches for changes';
export const builder = {
  files: {
    desc: 'File or glob of files that will be parsed.',
    default: '[**/*.js]',
  },
  out: {
    alias: 'o',
    desc: 'Directory your documentation will be generated in',
    default: 'docs',
  },
  root: {
    alias: 'r',
    desc: 'Directory to start parsing in',
    default: './',
  },
};

export const handler = (argv: any) => {
  const watchPath = Path.resolve(process.cwd(), argv.root);
  const watcher = Sane(watchPath, { glob: '**/*' });
  build(argv).then(() => {
    const bs = require('browser-sync').create();

    // Start a Browsersync static file server
    bs.init({ server: argv.out });

    const browserUpdate = () => {
      setTimeout(bs.reload, 100);
    };

    const onFileChange = (filepath: string, root: string) => {
      log.info('serve', 'file change', filepath);
      bs.notify('Compiling, please wait!');
      build(argv).then(browserUpdate);
    };

    watcher.on('change', onFileChange);
    watcher.on('add', onFileChange);
    watcher.on('delete', onFileChange);
  });
};
