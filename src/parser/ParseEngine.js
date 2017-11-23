// @flow

import { EventEmitter } from 'events'
import traverse from 'traverse'
import withSelectors from './selectors'
import doctrine from 'doctrine'

interface Parser {
  parse(str: string, options: ParseOptions): any;
}

export default class ParseEngine extends EventEmitter {
  constructor(parserName: string, parseOptions?: ParseOptions) {
    super()
    this.parserName = parserName
    this.parser = ((module.require(parserName): any): Parser)
    this.parseOptions = parseOptions
  }
  addFile(fileName: string, data: string): void {
    const ast: any = this.parse(data, { sourceFilename: fileName })
    this.emitNodes(ast)
  }
  parse(data: string, options?: ParseOptions): void {
    return this.parser.parse(data, { ...options, ...this.parseOptions })
  }
  emitNodes(ast: any) {
    // traverse uses keyword 'this' for context to the node itself,
    // so we dont use an arrow function, and we alias parseEngine
    const parseEngine = this
    traverse(ast).forEach(function(value: any): void {
      if (value && value.type) {
        maybeInjectTags(value)
        parseEngine.emit(value.type, withSelectors(this), value)
      }
    })
  }
}

function maybeInjectTags(node: any): void {
  if (node && node.type) {
    if (Array.isArray(node.leadingComments)) {
      node.__doc_tags__ = node.leadingComments.reduce(
        (acc: any[], leadingComment: any, index: number) => {
          if (leadingComment.type === 'CommentBlock') {
            return [].concat(
              doctrine.parse(leadingComment.value, {
                unwrap: true,
                sloppy: true,
              }),
              acc
            )
          }
        },
        []
      )
    }
  }
}
