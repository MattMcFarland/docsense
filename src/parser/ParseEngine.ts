import { EventEmitter } from 'events'
import { parse as docParse, Annotation } from 'doctrine'
import traverse from '@babel/traverse'
import types, { Node, Comment, CommentBlock } from 'babel-types'

interface withDocTags {
  __doc_tags__: Annotation[]
}
export type AST = Node & withDocTags

/** @interface ParseOptions parseOptions */
export interface ParseOptions {
  /** @property {boolean} allowImportExportEverywhere - By default, import and export declarations can only appear at a program's top level. Setting this option to true allows them anywhere where a statement is allowed. */
  allowImportExportEverywhere?: boolean
  /** @property {boolean} allowImportExportEverywhere - By default, a return statement at the top level raises an error. Set this to true to accept such code. */
  allowReturnOutsideFunction?: boolean
  /** @property {SourceType} sourceType - Indicate the mode the code should be parsed in. Can be one of "script", "module", or "unambiguous". Defaults to "script". "unambiguous" will make Babylon attempt to guess, based on the presence of ES6 import or export statements. Files with ES6 imports and exports are considered "module" and are otherwise "script". */
  sourceType?: 'script' | 'module' | 'unambiguous'
  /** @property {string} sourceFilename - Correlate output AST nodes with their source filename. Useful when generating code and source maps from the ASTs of multiple input files.*/
  sourceFilename?: string
  /** @property {number} startLine -  By default, the first line of code parsed is treated as line 1. You can provide a line number to alternatively start with. Useful for integration with other source tools.*/
  startLine?: number
  /** @property {string[]} plugins - Array containing the plugins that you want to enable. */
  plugins?: string[]
  /** @property {[number, number]} ranges - Adds a ranges property to each node: [node.start, node.end] */
  ranges?: [number, number]
  /** @property {boolean} tokens - Adds all parsed tokens to a tokens property on the File node */
  tokens?: boolean
}

/**
 * Parser
 */
export interface Parser {
  parse(str: string, options: ParseOptions): AST
}

/**
 * A Parser that emit events when it traverses over a node in which plugins can listen to
 * @class ParseEngine
 * @extends EventEmitter
 */
export default class ParseEngine extends EventEmitter {
  parser: Parser
  parserName: string
  parseOptions: ParseOptions
  doctrine: typeof docParse

  /**
   * @constructor
   * @param {string} parserName parser module to use
   * @param {ParseOptions} parseOptions options passed to the parser module
   */
  constructor(parserName: string, parseOptions: ParseOptions = {}) {
    super()
    this.parserName = parserName
    this.parser = module.require(parserName)
    this.parseOptions = parseOptions
  }

  /**
   * parses sourceCode under a filename, and emits events
   * @param {string} fileName of file to add
   * @param {string} sourceCode read from fs.readFile, encoded at utf-8
   */
  addFile(fileName: string, sourceCode: string): void {
    const ast: any = this.parse(sourceCode, { sourceFilename: fileName })
    const self = this
    traverse(ast, {
      enter(path) {
        self.maybeInjectTags(path.node)
      },
      exit(path) {
        if (path.type === 'Program') {
          self.emit('addFile', {
            fileName,
            path,
            traverse,
            types,
            sourceCode,
          })
        }
      },
    })
  }

  /**
   * Parses source code, used by addFile
   * @param {string} data code
   * @param {ParseOptions} options
   */
  parse(data: string, options?: ParseOptions): AST {
    return this.parser.parse(data, { ...options, ...this.parseOptions })
  }

  /**
   * Parse JSDoc and inject comment tags if applicable,
   * @param {any} path
   */
  maybeInjectTags(node: AST): void {
    if (Array.isArray(node.leadingComments)) {
      node.__doc_tags__ = this.injectTags(node.leadingComments)
    }
  }

  /**
   * Parse JSDoc and inject comment tags
   * @param { LeadingComment[]} leadingComments
   */
  injectTags(leadingComments: Comment[]): Array<Annotation> {
    const parseCommentTags = (content: string): Annotation =>
      docParse(content, {
        unwrap: true,
        sloppy: true,
      })
    const tagInjectReducer = (
      acc: Annotation[],
      leadingComment: Comment & CommentBlock
    ) =>
      (leadingComment.type &&
        leadingComment.type === 'CommentBlock' &&
        [].concat(parseCommentTags(leadingComment.value), acc)) ||
      acc

    return leadingComments.reduce(tagInjectReducer, [])
  }
}
