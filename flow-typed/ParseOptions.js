//@flow

/** @typedef ParseOptions parseOptions */
declare type ParseOptions = {
  /** @property {boolean} allowImportExportEverywhere - By default, import and export declarations can only appear at a program's top level. Setting this option to true allows them anywhere where a statement is allowed. */
  allowImportExportEverywhere?: boolean,
  /** @property {boolean} allowImportExportEverywhere - By default, a return statement at the top level raises an error. Set this to true to accept such code. */
  allowReturnOutsideFunction?: boolean,
  /** @property {SourceType} sourceType - Indicate the mode the code should be parsed in. Can be one of "script", "module", or "unambiguous". Defaults to "script". "unambiguous" will make Babylon attempt to guess, based on the presence of ES6 import or export statements. Files with ES6 imports and exports are considered "module" and are otherwise "script". */
  sourceType?: 'script' | 'module' | 'unambiguous',
  /** @property {string} sourceFilename - Correlate output AST nodes with their source filename. Useful when generating code and source maps from the ASTs of multiple input files.*/
  sourceFilename?: string,
  /** @property {number} startLine -  By default, the first line of code parsed is treated as line 1. You can provide a line number to alternatively start with. Useful for integration with other source tools.*/
  startLine?: number,
  /** @property {string[]} plugins - Array containing the plugins that you want to enable. */
  plugins?: string[],
  /** @property {[number, number]} ranges - Adds a ranges property to each node: [node.start, node.end] */
  ranges?: [number, number],
  /** @property {boolean} tokens - Adds all parsed tokens to a tokens property on the File node */
  tokens?: boolean,
}
