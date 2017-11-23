import EventEmitter from 'events'
import traverse from 'traverse'
import withSelectors from './selectors'
import doctrine from 'doctrine'

export default class ParseEngine extends EventEmitter {
  constructor(parserName: string, parseOptions?: any = {}) {
    super()
    this.parserName = parserName
    this.parser = module.require(parserName)
    this.parseOptions = parseOptions
  }
  addFile(fileName: string, data: string) {
    const ast = this.parse(data, { sourceFilename: fileName })
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
        maybeInjectTags(value)
        parseEngine.emit(value.type, withSelectors(this), value)
      }
    })
  }
}

function maybeInjectTags(node) {
  if (node && node.type) {
    if (Array.isArray(node.leadingComments)) {
      node.__doc_tags__ = node.leadingComments.reduce(
        (acc, leadingComment, index) => {
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
