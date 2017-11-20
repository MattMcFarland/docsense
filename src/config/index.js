//@flow

import cosmic from 'cosmiconfig'
import defaultConfig from './default-config.json'
import merge from 'deepmerge'
/**
 * @returns {Promise<DocSenseConfig>}
 */
export default (): Promise<DocSenseConfig> =>
  cosmic('docsense')
    .load(process.cwd())
    .then(({ config }) => merge(defaultConfig, config))
