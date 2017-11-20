//@flow

import cosmic from 'cosmiconfig'
import defaultConfig from './default-config.json'

/**
 * @returns {Promise<DocSenseConfig>}
 */
export default (): Promise<DocSenseConfig> =>
  cosmic('docsense')
    .load(process.cwd())
    .then(fileConfig => Object.assign({}, defaultConfig, fileConfig.config))
