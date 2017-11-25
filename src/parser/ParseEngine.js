// @flow

import { EventEmitter } from 'events'
import traverse from 'traverse'
import withSelectors from './selectors'
import Doctrine from 'doctrine'

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
 * @typedef ASTNode This is just a stub, will need to add more as we go
 */
type ASTNode = {
  type: string,
  leadingComments: LeadingComment[],
  __doc_tags__: Doctrine.Type[],
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
   * parses data under a filename, and emits events
   * @param {string} fileName of file to add
   * @param {string} data read from fs.readFile, encoded at utf-8
   */
  addFile(fileName: string, data: string): void {
    const ast: File = this.parse(data, { sourceFilename: fileName })
    this.emitNodes(ast)
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
   * Traverses a generated AST and emits events when it walks over a node
   * @param {File} ast
   */
  emitNodes(ast: File) {
    // traverse uses keyword 'this' for context to the node itself,
    // so we dont use an arrow function, and we alias parseEngine
    const parseEngine = this
    traverse(ast).forEach(function(value: ASTNode) {
      const contextSymbol = Symbol('ContextSymbol')
      this[contextSymbol] = 'ContextSymbol'
      if (value && value.type) {
        const ctx = this
        ctx.pathByType = ctx.path.map((id, index) => {
          const cursor = ctx.parents[index]
          cursor[contextSymbol] = 'ContextSymbol'
          if (cursor && cursor.node) {
            if (Array.isArray(cursor.node)) {
              return cursor.node[parseInt(id)].type
            }
            return cursor.node.type
          }
          return id
        })
        parseEngine.emit(value.type, withSelectors(ctx, contextSymbol), value)
      }
    })
  }

  /**
   * Parse JSDoc and inject comment tags if applicable,
   * @param {ASTNode} node
   */
  maybeInjectTags(node: ASTNode): void {
    if (node && node.type) {
      if (Array.isArray(node.leadingComments)) {
        node.__doc_tags__ = this.injectTags(node.leadingComments)
      }
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
