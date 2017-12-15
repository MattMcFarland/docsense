import { existsSync, writeFileSync } from 'fs';
import * as Path from 'path';
import * as Sane from 'sane';

import getConfig from '../../config';
import generator from '../../generator';
import { log } from '../../utils/logger';
import { parseFiles } from '../../utils/parse';
import { setupCorePlugins } from '../../utils/plugin';

export const command = 'build [Options]';
export const desc = 'Builds static doc site';
export const builder = {
  out: {
    desc: 'directory docs are generated in',
  },
  files: {
    desc: 'files matching this glob pattern will be parsed to documentation',
  },
  root: {
    desc:
      'ignores the parent, useful if your code is all in /src and you dont want docs to say "src"',
    default: './',
  },
};
export const handler = (argv: any) => {
  getConfig()
    .then(config => {
      const settings = { ...config, ...argv };
      return settings;
    })
    .then(setupCorePlugins)
    .then(parseFiles)
    .then(generator);
};
