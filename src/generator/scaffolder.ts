import { readdirSync, readFileSync } from 'fs';
import * as mkdirp from 'mkdirp';
import { resolve as resolvePath } from 'path';
import { promisify } from 'util';

import getConfig from '../config';
import { ESModule } from '../core-plugins/es-modules';
import { createFile, withAllFiles } from './file';

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
  const files = readdirSync(resolvePath(__dirname, 'static'));
  return Promise.all(
    files.map(filename => {
      const data = readFileSync(resolvePath(__dirname, 'static', filename));
      return createFile(resolvePath(targetDir, 'static', filename), data);
    })
  );
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
