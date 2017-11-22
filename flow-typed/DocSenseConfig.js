// @flow

/**
 * @typedef {Object} DocSenseConfig
 */
type DocSenseConfig = {
  /** @property {string} files - files to parse  */
  files: string[],
  /** @property {string} parser - module name that will parse the AST, this will be "required" in and use parser.parse */
  parser: string,
  /** @property {any} parseOptions - options passed as options to parser */
  parseOptions: any,
  userCorePlugins: boolean,
  out: string,
}
