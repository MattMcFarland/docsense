import traverse, { Node, NodePath } from 'babel-traverse';
import { Comment, CommentBlock } from 'babel-types';
import { Annotation, parse as docParse } from 'doctrine';
import { EventEmitter } from 'events';

import { ConfigParseOptions, DocSenseConfig } from '../config';

const types = require('babel-types');

/**
 * Parser
 */
export interface IParser {
  parse(str: string, options: ConfigParseOptions): Node;
}

/**
 * A Parser that emit events when it traverses over a node in which plugins can listen to
 * @class ParseEngine
 * @extends EventEmitter
 */
export default class ParseEngine extends EventEmitter {
  public parseOptions: ConfigParseOptions;
  public config: DocSenseConfig;
  private parser: IParser;
  private parserName: string;
  private doctrine: typeof docParse;

  /**
   * @constructor
   * @param {string} parserName parser module to use
   * @param {ConfigParseOptions} parseOptions options passed to the parser module
   */
  constructor(config: DocSenseConfig) {
    super();
    this.parserName = config.parser;
    this.parser = module.require(config.parser);
    this.parseOptions = config.parseOptions ? config.parseOptions : {};
    this.config = config;
  }

  /**
   * parses sourceCode under a filename, and emits events
   * @param {string} fileName of file to add
   * @param {string} sourceCode read from fs.readFile, encoded at utf-8
   */
  public addFile(fileName: string, sourceCode: string): void {
    const ast: Node = this.parse(sourceCode, { sourceFilename: fileName });
    traverse(ast, {
      enter: path => {
        this.maybeInjectTags(path.node);
      },
      exit: path => {
        if (path.type === 'Program') {
          this.emit('addFile', {
            fileName,
            path,
            traverse,
            types,
            sourceCode,
          });
        }
      },
    });
  }

  /**
   * Parses source code, used by addFile
   * @param {string} data code
   * @param {ConfigParseOptions} options
   */
  private parse(data: string, options?: ConfigParseOptions): Node {
    return this.parser.parse(data, { ...options, ...this.parseOptions });
  }

  /**
   * Parse JSDoc and inject comment tags if applicable,
   * @param {any} path
   */
  private maybeInjectTags(node: Node): void {
    if (Array.isArray(node.leadingComments)) {
      node.__doc_tags__ = this.injectTags(node.leadingComments);
    }
  }

  /**
   * Parse JSDoc and inject comment tags
   * @param { LeadingComment[]} leadingComments
   */
  private injectTags(leadingComments: Comment[]): Annotation[] {
    const parseCommentTags = (content: string): Annotation =>
      docParse(content, {
        unwrap: true,
        sloppy: true,
      });
    const tagInjectReducer = (
      acc: Annotation[],
      leadingComment: Comment | CommentBlock
    ) => {
      if (isCommentBlock(leadingComment)) {
        acc.push(parseCommentTags(leadingComment.value));
      }
      return acc;
    };

    return leadingComments.reduce(tagInjectReducer, []);
  }
}

function isCommentBlock(
  comment: Comment | CommentBlock
): comment is CommentBlock {
  return (comment as CommentBlock).type === 'CommentBlock';
}
