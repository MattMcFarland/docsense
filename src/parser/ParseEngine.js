// @flow

import { EventEmitter } from 'events'
import traverse from 'traverse'
import withSelectors from './selectors'
import Doctrine, { Syntax } from 'doctrine'
import Babylon from 'babylon'

interface Parser {
  parse(str: string, options: ParseOptions): File;
}
type LeadingComment = {
  value: string,
  type: Doctrine.Type,
}
type ASTNode = {
  type: string,
  leadingComments: LeadingComment[],
  __doc_tags__: Doctrine.Type[],
}
export default class ParseEngine extends EventEmitter {
  parser: Parser
  parserName: string
  parseOptions: ParseOptions
  doctrine: Doctrine
  constructor(parserName: string, parseOptions?: ParseOptions = {}) {
    super()
    this.parserName = parserName
    this.parser = (module.require(parserName): Parser)
    this.parseOptions = parseOptions
  }
  addFile(fileName: string, data: string): void {
    const ast: File = this.parse(data, { sourceFilename: fileName })
    this.emitNodes(ast)
  }
  parse(data: string, options?: ParseOptions): File {
    return this.parser.parse(data, { ...options, ...this.parseOptions })
  }
  emitNodes(ast: File) {
    // traverse uses keyword 'this' for context to the node itself,
    // so we dont use an arrow function, and we alias parseEngine
    const parseEngine = this
    traverse(ast).forEach(function(value: ASTNode) {
      if (value && value.type) {
        parseEngine.maybeInjectTags(value)
        parseEngine.emit(value.type, withSelectors(this), value)
      }
    })
  }
  maybeInjectTags(node: ASTNode): void {
    if (node && node.type) {
      if (Array.isArray(node.leadingComments)) {
        node.__doc_tags__ = this.injectTags(node.leadingComments)
      }
    }
  }
  /**
   *
   * @param {*} leadingComments
   */
  injectTags(leadingComments: LeadingComment[]) {
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
