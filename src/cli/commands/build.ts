import { existsSync, writeFileSync } from 'fs';
import * as mkdirp from 'mkdirp';
import * as Path from 'path';
import * as Sane from 'sane';

import getConfig from '../../config';
import generator from '../../generator';
import { fatalError } from '../../utils/common';

import { parseFiles } from '../../utils/parse';
import { setupCorePlugins } from '../../utils/plugin';

export const command = 'build [Options|files..]';
export const aliases = ['b'];
export const desc = 'Builds static doc site';
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
    default: 'CWD',
  },
};
export const handler = (argv: any) => {
  if (typeof argv.files === 'string') argv.files = [argv.files];
  process.env.DOCSENSE_CONFIG = JSON.stringify(argv);
  mkdirp.sync(argv.out);
  return Promise.resolve(argv)
    .then(setupCorePlugins)
    .then(parseFiles)
    .then(generator)
    .catch(fatalError);
};
