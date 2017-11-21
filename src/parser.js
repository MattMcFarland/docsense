import EventEmitter from 'events'
import traverse from 'traverse'

const tagRegex = /(@\S+)({?.*?})?(\s*?.*)?/gi

/**
 * A Parser that emits events named after the node types that are in the AST
 * e.g., parser.on('VariableDeclaration', (node) => console.log(node))
 */
export default class Parser extends EventEmitter {
  constructor(parser, parseOptions) {
    super()
    this.parser = parser
    this.parseOptions = parseOptions
  }
  parse(data) {
    const ast = this.parser.parse(data, this.parseOptions)
    const self = this
    traverse(ast).forEach(node => {
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

function createCommentTagMeta({ value = '' }, loc) {
  let matches = []
  const result = []
  value.replace(tagRegex, (match, tagName, tagType, tagLabel) => {
    if (typeof tagName) {
      const tag = { tagName }
      if (tagType) tag.tagType = tagType.trim()
      if (tagLabel) tag.tagLabel = tagLabel.trim()
      result.push(tag)
    }
  })
  return result
}
