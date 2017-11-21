// @flow
import EventEmitter from 'events'
import traverse from 'traverse'

// created this using regex101, work is here: https://regex101.com/r/jrLmHj/4/
const tagRegex = /(@\w+)([\t \S]*{[\s]*(\w+)[\s]*}[\t \S](\[[\t \S]+\]|\b\S+\b))?[\s]+(.*)[\r\n]/gi

/**
 * @class Parser
 * @extends {EventEmitter} Event Emitter
 *
 */
export default class Parser extends EventEmitter {
  /**
   * @private {*} parser
   */
  parser: { parse: (data: string, parseOptions: any) => AST }
  /**
   * @private {*} parseOptions
   */
  parseOptions: any
  /**
   * A parser that emits events, so we can have Big O Constant time
   * with increased complexity. (goal anyway)
   * @param {*} parser - parser to use (like babylon, flow, etc)
   * @param {*} parseOptions - options to pass to the parser
   */
  constructor(parser: string, parseOptions: any) {
    super()
    this.parser = module.require(parser)
    this.parseOptions = parseOptions
  }
  /**
   * Perform parse of the AST string, emits events when each node is parsed
   * @param {string} data
   */
  parse(data: string) {
    const ast = this.parser.parse(data, this.parseOptions)
    const self = this
    traverse(ast).forEach((node: AST) => {
      if (node && node.type) {
        if (Array.isArray(node.leadingComments)) {
          node.__doc_tags__ = node.leadingComments.reduce(
            (acc, leadingComment, index) => {
              if (leadingComment.type === 'CommentBlock') {
                return [].concat(
                  createCommentTagMeta(leadingComment, leadingComment.loc),
                  acc
                )
              }
            },
            []
          )
        }
        self.emit(node.type, node)
      }
    })
    return ast
  }
}

/**
 *
 * @param {Object} param
 * @param {*} param.value
 * @param {*} loc
 */
function createCommentTagMeta({ value = '' }: { value: string }, loc) {
  let matches = []
  const result = []

  value.replace(tagRegex, (match, tagName, _, tagType, label, description) => {
    if (tagName) {
      const tag: DocTag = { tagName }
      if (tagType) tag.tagType = tagType
      if (label) tag.label = label
      if (description) tag.description = description
      result.push(tag)
    }
  })
  return result
}
