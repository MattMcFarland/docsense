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
  glob: {
    desc: 'files matching this glob pattern will trigger a rebuild',
    default: ['**/*'],
  },
  root: {
    desc: 'root path to watch for file changes that trigger a new doc build',
  },
};

export const handler = (argv: any) => {
  const watchPath = Path.resolve(process.cwd(), argv.root);
  const watcher = Sane(watchPath, { glob: argv.glob });
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
