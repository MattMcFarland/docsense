import { existsSync, writeFileSync } from 'fs';
import * as Path from 'path';
import * as Sane from 'sane';
import { log } from '../../utils/logger';
import { handler as build } from './build';

export const command = 'serve [Options]';
export const desc = 'Serves up a local docsense app that watches for changes';
export const builder = {
  out: {
    desc:
      'directory docs are generated in, when thse change the browser will refresh',
  },
  files: {
    desc: 'files matching this glob pattern will trigger a rebuild',
  },
  root: {
    desc:
      'path to watch for changes to trigger a rebuild, glob patterns will not be matched against parents of root',
    default: './',
  },
};
export const handler = (argv: any) => {
  const resolvedWatchPath = Path.resolve(argv.root);
  const watcher = Sane(resolvedWatchPath, { glob: argv.files });

  const bs = require('browser-sync').create();
  watcher.on('change', (filepath: string, root: string, stat: any) => {
    build(argv);
    log.info('serve', 'file change', filepath);
  });

  watcher.on('add', (filepath: string, root: string, stat: any) => {
    build(argv);
    log.info('serve', 'file add', filepath);
  });

  watcher.on('delete', (filepath: string, root: string) => {
    build(argv);
    log.info('serve', 'file delete', filepath);
  });

  // Listen to change events on HTML and reload
  // TODO: use config for directory to watch
  bs.watch(argv.out + '/**/*').on('change', bs.reload);

  // Start a Browsersync static file server
  bs.init({
    server: argv.out,
  });
};
