import { readdirSync, readFileSync } from 'fs';
import * as mkdirp from 'mkdirp';
import { resolve as resolvePath } from 'path';
import { promisify } from 'util';
import { log } from '../utils/logger';

import getConfig from '../config';
import { ESModule } from '../core-plugins/es-modules';
import { createFile, withAllFiles } from '../utils/file';

const mkdir = promisify(mkdirp);

// const distDir = require('path').resolve(__dirname, '../../docs');
export const makeNodeModuleStatic = (
  require_module: string,
  target: string
) => {
  const data = readFileSync(require.resolve(require_module), 'utf8');
  return createFile(target, data);
};

export const copyFiles = (
  sourceDir: string,
  targetDir: string,
  alias?: string
) => {
  const copydir = require('copy-dir');
  const from = resolvePath(__dirname, sourceDir);
  const to = resolvePath(targetDir, alias || 'static');

  return new Promise((resolve, reject) => {
    copydir(from, to, (err: Error) => {
      if (err) return reject(err);
      return resolve(true);
    });
  });
};

export const scaffoldStaticAssets = (outDir: string) => {
  log.info('scaffold', 'static assets');
  makeNodeModuleStatic(
    'tachyons/css/tachyons.min.css',
    outDir + '/static/css/tachyons.min.css'
  );
  makeNodeModuleStatic(
    'highlightjs/styles/mono-blue.css',
    outDir + '/static/css/hljs.style.css'
  );
  makeNodeModuleStatic(
    'highlightjs/highlight.pack.min.js',
    outDir + '/static/js/highlight.js'
  );
  makeNodeModuleStatic(
    'highlightjs-line-numbers.js/dist/highlightjs-line-numbers.min.js',
    outDir + '/static/js/highlightjs-line-numbers.min.js'
  );
};
