const DefaultConfig: DocSenseConfig = {
  out: 'docs',
  parser: 'babylon',
  parseOptions: {
    tokens: false,
  },
  files: [],
  main: './README',
  root: './',
};

export default DefaultConfig;

/** @interface ParseOptions parseOptions */
export interface ConfigParseOptions {
  /**
   * By default, import and export declarations can only appear at a program's top level. Setting this option to true allows them anywhere where a statement is allowed.
   * @TJS-TYPE bool
   */
  allowImportExportEverywhere?: boolean;
  /**
   *  By default, a return statement at the top level raises an error. Set this to true to accept such code.
   * @TJS-TYPE bool
   */
  allowReturnOutsideFunction?: boolean;
  /**
   * Indicate the mode the code should be parsed in. Can be one of "script", "module", or "unambiguous". Defaults to "script". "unambiguous" will make Babylon attempt to guess, based on the presence of ES6 import or export statements. Files with ES6 imports and exports are considered "module" and are otherwise "script".
   *
   */
  sourceType?: 'script' | 'module' | 'unambiguous';
  /**
   * Correlate output AST nodes with their source filename.
   * Useful when generating code and source maps from the ASTs of multiple input files.
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
   *
   */
  ranges?: [number, number];
  /**
   * Adds all parsed tokens to a tokens property on the File node
   * @TJS-TYPE bool
   */
  tokens?: boolean;
}

export interface DocSenseConfig {
  /**
   * Array of files or glob patterns of which you want to parse for documentation
   */
  files: string[];
  /**
   * Parser, currently 'babylon' is only supported
   */
  parser: 'babylon';
  /**
   * Options passed to the parser
   */
  parseOptions?: ConfigParseOptions;
  /**
   * Path of which the documentation will be generated.
   */
  out: string;
  /**
   * What markdown file to load for the main page. (e.g., './README')
   */
  main: string;
  /**
   * The root path of the project
   */
  root: string;
}
