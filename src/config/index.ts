import * as cosmic from 'cosmiconfig';
import * as merge from 'deepmerge';
import { IParseOptions } from '../parser/ParseEngine';
import defaultConfig from './default-config';
/**
 * @returns {Promise<IConfig>} Configuration
 */
export default (): Promise<IConfig> =>
  cosmic('docsense')
    .load(process.cwd())
    .then(({ config }) => merge(defaultConfig, config));

/**
 * @typedef {Object} IConfig
 */
export interface IConfig {
  files: string[];
  parser?: string;
  parseOptions?: IParseOptions;
  useCorePlugins?: boolean;
  out?: string;
}
