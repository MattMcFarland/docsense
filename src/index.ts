import getConfig from './config';
import { fatalError, logContext } from './utils/common';
import { init as initializeLogger } from './utils/logger';
import { parseFiles } from './utils/parse';
import { setupCorePlugins } from './utils/plugin';

export default () => {
  initializeLogger();
  return getConfig()
    .then(setupCorePlugins)
    .then(parseFiles);
};
