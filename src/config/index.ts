import * as cosmic from 'cosmiconfig';
import * as merge from 'deepmerge';

import { fatalError } from '../utils/common';
import defaultConfig, { DocSenseConfig } from './default-config';

/**
 * @returns {Promise<DocSenseConfig>} Configuration
 */
export default (): Promise<DocSenseConfig> =>
  cosmic('docsense')
    .load(process.cwd())
    .then(state => {
      if (!state) return defaultConfig;
      if (!state.config) return defaultConfig;
      return merge(defaultConfig, state.config);
    })
    .catch(fatalError);
