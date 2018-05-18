import { DocSenseConfig } from './index';

const DefaultConfig: DocSenseConfig = {
  out: 'docs',
  parser: 'babylon',
  parseOptions: {
    tokens: false,
  },
  files: [],
  main: './README',
  root: './',
  manual: undefined,
};

export default DefaultConfig;
