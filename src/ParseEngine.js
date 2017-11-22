import EventEmitter from 'events'
import traverse from 'traverse'

// created this using regex101, work is here: https://regex101.com/r/jrLmHj/4/
const tagRegex = /(@\w+)([\t \S]*{[\s]*(\w+)[\s]*}[\t \S](\[[\t \S]+\]|\b\S+\b))?[\s]+(.*)[\r\n]/gi

export default class ParseEngine extends EventEmitter {
  constructor(parserName: string, parseOptions?: any = {}) {
    super()
    this.parserName = parserName
    this.parser = module.require(parserName)
    this.parseOptions = parseOptions
  }
  addFile(fileName: string, data: string) {
    const ast = this.parse(data, { sourceFilename: fileName })
    ast.__id__ = new Identifier(fileName, ast.start, ast.end)
    this.emitNodes(ast)
  }
  parse(data: string, options?: any = {}) {
    return this.parser.parse(data, { ...options, ...this.parseOptions })
  }
  emitNodes(ast: AST) {
    // traverse uses keyword 'this' for context to the node itself,
    // so we dont use an arrow function, and we alias parseEngine
    const parseEngine = this
    traverse(ast).forEach(function(value: AST) {
      if (value && value.type) {
        parseEngine.emit(value.type, this, value)
      }
    })
  }
}

class Identifier {
  type: string
  start: number
  end: number
  loc: {
    start: number,
    end: number,
    identifierName: string,
  }
  name: string
  constructor(name: string, start: number, end: number) {
    this.name = name
    this.start = start
    this.end = end
    this.loc = {
      start,
      end,
      identifierName: name,
    }
    return this
  }
}

// if (Array.isArray(value.leadingComments)) {
//   value.__doc_tags__ = value.leadingComments.reduce(
//     (acc, leadingComment, index) => {
//       if (leadingComment.type === 'CommentBlock') {
//         return [].concat(
//           createCommentTagMeta(leadingComment, leadingComment.loc),
//           acc
//         )
//       }
//     },
//     []
//   )
// }

function maybeInjectTags(node) {
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
  }
}

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
