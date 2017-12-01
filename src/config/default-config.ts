import { IConfig } from 'src/config';

const DefaultConfig: IConfig = {
  out: 'docs',
  parser: 'babylon',
  parseOptions: {
    tokens: false,
  },
  useCorePlugins: true,
  files: [],
};

export default DefaultConfig;
