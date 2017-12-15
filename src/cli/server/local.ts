import * as Path from 'path';
import * as Sane from 'sane';

import { DocSenseConfig } from '../../config/default-config';
import { log } from '../../utils/logger';

export default function(
  config: DocSenseConfig,
  watchPath: string = process.cwd(),
  watchGlobs: string[] = ['**/*'],
  onChange: () => void
) {
  const resolvedWatchPath = Path.resolve(watchPath);
  const watcher = Sane(resolvedWatchPath, { glob: watchGlobs });

  const bs = require('browser-sync').create();
  watcher.on('change', (filepath: string, root: string, stat: any) => {
    onChange();
    log.info('serve', 'file change', filepath);
  });

  watcher.on('add', (filepath: string, root: string, stat: any) => {
    onChange();
    log.info('serve', 'file add', filepath);
  });

  watcher.on('delete', (filepath: string, root: string) => {
    onChange();
    log.info('serve', 'file delete', filepath);
  });

  // Listen to change events on HTML and reload
  // TODO: use config for directory to watch
  bs.watch(config.out + '/**/*').on('change', bs.reload);

  // Start a Browsersync static file server
  bs.init({
    server: config.out,
  });
}
