import { readdirSync, readFileSync } from 'fs';
import * as mkdirp from 'mkdirp';
import { resolve as resolvePath } from 'path';
import { promisify } from 'util';

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

export const copyStaticFiles = (targetDir: string) => {
  // todo: get module definition (d.ts) for `copy-dir` and import it properly.
  const copydir = require('copy-dir');
  const from = resolvePath(__dirname, 'templates/static');
  const to = resolvePath(targetDir, 'static');

  return new Promise((resolve, reject) => {
    copydir(from, to, (err: Error) => {
      if (err) return reject(err);
      return resolve(true);
    });
  });
};

export const scaffoldStaticAssets = (outDir: string) => {
  makeNodeModuleStatic(
    'tachyons/css/tachyons.min.css',
    outDir + '/static/tachyons.min.css'
  );
  makeNodeModuleStatic(
    'highlightjs/highlight.pack.min.js',
    outDir + '/static/highlight.js'
  );
  makeNodeModuleStatic(
    'highlightjs/styles/mono-blue.css',
    outDir + '/static/hljs.style.css'
  );
};
