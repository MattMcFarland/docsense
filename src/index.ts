import getConfig from './config';
import { parseFiles } from './parser/parse';
import { setupCorePlugins } from './parser/plugin-loader';
import { fatalError, logContext } from './utils/common';
import { init as initializeLogger, LogLevel } from './utils/logger';

export default () => {
  initializeLogger(LogLevel.info);
  return getConfig()
    .then(setupCorePlugins)
    .then(parseFiles);
};
