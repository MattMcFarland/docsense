import * as cosmic from 'cosmiconfig';
import * as merge from 'deepmerge';
import defaultConfig, { DocSenseConfig } from './default-config';
/**
 * @returns {Promise<DocSenseConfig>} Configuration
 */
export default (): Promise<DocSenseConfig> =>
  cosmic('docsense')
    .load(process.cwd())
    .then(({ config }) => merge(defaultConfig, config));
