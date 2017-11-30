// @flow

import { EventEmitter } from 'events'
import Doctrine from 'doctrine'
import traverse from '@babel/traverse'
import types from '@babel/types'

/**
 * Parser
 */
interface Parser {
  parse(str: string, options: ParseOptions): File;
}

/**
 * @typedef LeadingComment This is just a stub, will need to add more as we go
 */
type LeadingComment = {
  value: string,
  type: Doctrine.Type,
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
  doctrine: Doctrine

  /**
   * @constructor
   * @param {string} parserName parser module to use
   * @param {ParseOptions} parseOptions options passed to the parser module
   */
  constructor(parserName: string, parseOptions?: ParseOptions = {}) {
    super()
    this.parserName = parserName
    this.parser = (module.require(parserName): Parser)
    this.parseOptions = parseOptions
  }

  /**
   * parses sourceCode under a filename, and emits events
   * @param {string} fileName of file to add
   * @param {string} sourceCode read from fs.readFile, encoded at utf-8
   */
  addFile(fileName: string, sourceCode: string): void {
    const ast: File = this.parse(sourceCode, { sourceFilename: fileName })
    const self = this
    traverse(ast, {
      enter(path) {
        self.maybeInjectTags(path)
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
  parse(data: string, options?: ParseOptions): File {
    return this.parser.parse(data, { ...options, ...this.parseOptions })
  }

  /**
   * Parse JSDoc and inject comment tags if applicable,
   * @param {any} path
   */
  maybeInjectTags(path: any): void {
    if (Array.isArray(path.node.leadingComments)) {
      path.node.__doc_tags__ = this.injectTags(path.node.leadingComments)
    }
  }

  /**
   * Parse JSDoc and inject comment tags
   * @param { LeadingComment[]} leadingComments
   */
  injectTags(leadingComments: LeadingComment[]): Doctrine.Type[] {
    const parseCommentTags = (content: string): Doctrine.Type[] =>
      Doctrine.parse(content, {
        unwrap: true,
        sloppy: true,
      })
    const tagInjectReducer = (
      acc: Doctrine.Type[],
      leadingComment: LeadingComment
    ) =>
      (leadingComment.type === 'CommentBlock' &&
        [].concat(parseCommentTags(leadingComment.value), acc)) ||
      acc

    return leadingComments.reduce(tagInjectReducer, [])
  }
}
