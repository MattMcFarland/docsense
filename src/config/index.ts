import { ParseOptions } from '../parser/ParseEngine';
/**
 * @typedef {Object} IConfig
 */
export interface IConfig {
  /** @property {string} files - files to parse  */
  files: string[];
  /** @property {string} parser - module name that will parse the AST, this will be "required" in and use parser.parse */
  parser: string;
  /** @property {any} parseOptions - options passed as options to parser */
  parseOptions: ParseOptions;
  userCorePlugins: boolean;
  out: string;
}

import cosmic from 'cosmiconfig';
import defaultConfig from './default-config.json';
import merge from 'deepmerge';
/**
 * @returns {Promise<IConfig>}
 */
export default (): Promise<IConfig> =>
  cosmic('docsense')
    .load(process.cwd())
    .then(({ config }) => merge(defaultConfig, config));
