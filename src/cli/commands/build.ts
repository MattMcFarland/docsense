import { existsSync, writeFileSync } from 'fs';
import * as mkdirp from 'mkdirp';
import * as Path from 'path';
import * as Sane from 'sane';
import * as yargs from 'yargs';

import getConfig from '../../config';
import generator from '../../generator';
import { fatalError } from '../../utils/common';
import { addMarkdownFiles } from '../../utils/manual';
import { parseFiles } from '../../utils/parse';
import { setupCorePlugins } from '../../utils/plugin';

export const command = 'build [Options]';
export const aliases = ['b'];
export const desc = 'Builds static doc site';

export const builder: yargs.CommandBuilder = argv => {
  return yargs
    .options({
      files: {
        alias: 'f',
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
    })
    .example(
      '$0 build',
      'builds docs using your config file instead of options (recommended) '
    )
    .example('$0 build --out foo', 'Docs are generated into the foo directory')
    .example(
      '$0 build --root lib --files "**/*.js"',
      'Files matching the glob pattern will be parsed for document generation'
    )
    .example('$0 build --debug', 'Oververbose logging');
};

export const handler = (argv: any) => {
  if (typeof argv.files === 'string') argv.files = [argv.files];
  process.env.DOCSENSE_CONFIG = JSON.stringify(argv);
  mkdirp.sync(argv.out);
  return Promise.resolve(argv)
    .then(setupCorePlugins)
    .then(parseFiles)
    .then(addMarkdownFiles)
    .then(generator)
    .catch(fatalError);
};
