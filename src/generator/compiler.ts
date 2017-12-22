import { readFileSync } from 'fs';
import * as marked from 'marked';
import * as emoji from 'node-emoji';
import * as path from 'path';

import { DocSenseConfig } from '../config/index';
import { createFile, withAllFiles } from '../utils/file';
import { log } from '../utils/logger';
import markedStyle from './marked/renderer';

const mdHeadingsRe = new RegExp(/(#+.[\S ]+(?=\n))+([^#]+)/g);

class Compiler {
  private Handlebars: typeof Handlebars;
  private config: DocSenseConfig;

  constructor(config: DocSenseConfig) {
    this.config = config;
    this.Handlebars = require('handlebars');
    this.registerHelpers();
    this.registerPartials();
    this.compile = this.compile.bind(this);
  }

  public compile(source: string, data: any, target: string) {
    const Handlebars = this.Handlebars;
    const template = Handlebars.compile(source, { preventIndent: true });
    const content = template(data);
    const withLayout = this.compileLayout(content, data);
    const targetPath = path.resolve(process.cwd(), this.config.out, target);
    log.silly('write', targetPath);
    createFile(targetPath, withLayout);
  }

  private compileLayout(page: any, data: any) {
    const Handlebars = this.Handlebars;
    const layout_source = require_template('./default-template/_layout.hbs');
    const template = Handlebars.compile(layout_source, { preventIndent: true });
    const result = template({
      page,
      ...data,
    });
    return result;
  }

  private registerHelpers() {
    const Handlebars = this.Handlebars;
    require('handlebars-helpers')();
    withAllFiles(
      path.resolve(__dirname, 'default-template/helpers'),
      (src: string, filepath: string) => {
        if (filepath !== undefined) {
          const filename = filepath
            .split('/')
            .map(x => x)
            .pop();
          const helperName = filename ? filename.split('.').shift() : undefined;
          if (helperName) {
            log.silly('hbs registerHelper', helperName, filepath);
            Handlebars.registerHelper(
              helperName,
              require(`./default-template/helpers/${filename}`).default
            );
          }
        }
      }
    );
  }

  private registerPartials() {
    const Handlebars = this.Handlebars;
    withAllFiles(
      path.resolve(__dirname, 'default-template/partials'),
      (src: string, filepath: string) => {
        if (filepath !== undefined) {
          const filename = filepath.split('/').pop();
          const partialName = filename
            ? filename.split('.').shift()
            : undefined;
          if (partialName) {
            log.silly('hbs registerPartial', partialName, filepath);
            Handlebars.registerPartial(partialName, src);
          }
        }
      }
    );
  }
}

export const makeCompile = (config: DocSenseConfig) => {
  const compiler = new Compiler(config);
  return (source: string, data: any, target: string) =>
    compiler.compile(source, data, target);
};

export const require_template = (relPath: string) => {
  log.silly('read template', relPath);
  const targetPath = require.resolve(relPath);
  return readFileSync(targetPath, 'utf8');
};

export const require_md = (cwdPath: string) => {
  const renderer = markedStyle();
  marked.setOptions({ renderer });
  log.silly('markdown', cwdPath);
  const targetPath = cwdPath.endsWith('.md') ? cwdPath : cwdPath + '.md';
  const resolvedTargetPath = path.resolve(process.cwd(), targetPath);
  const raw = readFileSync(resolvedTargetPath, 'utf8');
  const data = marked(addEmojis(raw));

  let keepParsing = true;
  const matches = [];
  // tslint:disable-next-line:no-conditional-assignment
  while (keepParsing) {
    const match = mdHeadingsRe.exec(raw);
    if (match !== null) {
      matches.push(match);
    } else {
      keepParsing = false;
    }
  }
  const chunks = matches.map((match: any) => {
    const heading = match[1];
    const content = match[2];
    const lexer = new marked.Lexer();
    const tokens = lexer.lex(heading);
    return {
      depth: (tokens[0] as marked.Tokens.Heading).depth,
      content: marked.parse(content),
      heading: marked.parse(heading),
    };
  });
  const title =
    chunks !== undefined &&
    Array.isArray(chunks) &&
    chunks.find(ch => ch.depth === 1);

  return {
    title,
    raw,
    data,
    chunks,
  };
};

export const addEmojis = (markdown: string) => {
  const replacer = (match: any) => emoji.emojify(match);
  return markdown.replace(/(:.*:)/g, replacer);
};

export default Compiler;
