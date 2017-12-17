import * as cosmic from 'cosmiconfig';
import * as merge from 'deepmerge';

import { fatalError } from '../utils/common';
import defaultConfig from './default-config';

/**
 * @returns {Promise<DocSenseConfig>} Configuration
 */
export default (): Promise<DocSenseConfig> =>
  cosmic('docsense')
    .load(process.cwd())
    .then(state => {
      if (typeof process.env.DOCSENSE_CONFIG === 'string')
        return JSON.parse(<string>process.env.DOCSENSE_CONFIG);
      if (!state) return defaultConfig;
      if (!state.config) return defaultConfig;
      return merge(defaultConfig, state.config);
    })
    .catch(fatalError);

/** @interface ParseOptions parseOptions */
export interface ConfigParseOptions {
  /**
   * By default, import and export declarations can only appear at a program's top level. Setting this option to true allows them anywhere where a statement is allowed.
   * @property {boolean} allowImportExportEverywhere
   * @TJS-TYPE bool
   */
  allowImportExportEverywhere?: boolean;
  /**
   * By default, a return statement at the top level raises an error. Set this to true to accept such code.
   * @property {boolean} allowReturnOutsideFunction
   * @TJS-TYPE bool
   */
  allowReturnOutsideFunction?: boolean;
  /**
   * Indicate the mode the code should be parsed in. Can be one of "script", "module", or "unambiguous". Defaults to "script". "unambiguous" will make Babylon attempt to guess, based on the presence of ES6 import or export statements. Files with ES6 imports and exports are considered "module" and are otherwise "script".
   * @property {enum} sourceType
   */
  sourceType?: 'script' | 'module' | 'unambiguous';
  /**
   * Correlate output AST nodes with their source filename.
   * Useful when generating code and source maps from the ASTs of multiple input files.
   * @property {string} sourceFilename
   * @TJS-TYPE string
   */
  sourceFilename?: string;
  /**
   * By default, the first line of code parsed is treated as line 1. You can provide a line number to alternatively start with. Useful for integration with other source tools.
   * @property {number} startLine -
   * @TJS-TYPE integer
   */
  startLine?: number;
  /**
   * @property {string[]} plugins - Array containing the plugins that you want to enable.
   * @TJS-TYPE string
   */
  plugins?: string[];
  /**
   * Adds a ranges property to each node: [node.start, node.end]
   * @property {[number, number]} ranges
   */
  ranges?: [number, number];
  /**
   * Adds all parsed tokens to a tokens property on the File node
   * @TJS-TYPE bool
   * @property {boolean} tokens
   */
  tokens?: boolean;
}

/**
 *  @interface DocSenseConfig
 */
export interface DocSenseConfig {
  /**
   * Array of files or glob patterns of which you want to parse for documentation
   * @property {string[]} files
   */
  files: string[];
  /**
   * Parser, currently 'babylon' is only supported
   * @property {enum['babylon']} parser
   */
  parser: 'babylon';
  /**
   * Options passed to the parser
   * @property {ConfigParseOptions} parseOptions
   */
  parseOptions?: ConfigParseOptions;
  /**
   * Path of which the documentation will be generated.
   * @property {string} out
   */
  out: string;
  /**
   * What markdown file to load for the main page. (e.g., './README')
   * @property {string} main
   */
  main: string;
  /**
   * The root path of the project
   * @property {string} root
   */
  root: string;
}
