// @flow
import EventEmitter from 'events'
import traverse from 'traverse'

// created this using regex101, work is here: https://regex101.com/r/jrLmHj/4/
const tagRegex = /(@\w+)([\t \S]*{[\s]*(\w+)[\s]*}[\t \S](\[[\t \S]+\]|\b\S+\b))?[\s]+(.*)[\r\n]/gi

/**
 * A Parser that emits events named after the node types that are in the AST
 * e.g., parser.on('VariableDeclaration', (node) => console.log(node))
 */
export default class Parser extends EventEmitter {
  parser: { parse: (data: string, parseOptions: any) => AST }
  parseOptions: any
  constructor(parser: string, parseOptions: any) {
    super()
    this.parser = module.require(parser)
    this.parseOptions = parseOptions
  }
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
