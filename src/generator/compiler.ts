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
    const template = Handlebars.compile(source);
    const content = template(data);
    const withLayout = this.compileLayout(content, data);
    const targetPath = path.resolve(process.cwd(), this.config.out, target);
    log.verbose('compile', targetPath);
    createFile(targetPath, withLayout);
  }

  private compileLayout(page: any, data: any) {
    const Handlebars = this.Handlebars;
    const layout_source = require_template('./templates/_layout.hbs');
    const template = Handlebars.compile(layout_source);
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
      path.resolve(__dirname, 'templates/helpers'),
      (src: string, filepath: string) => {
        if (filepath !== undefined) {
          const filename = filepath
            .split('/')
            .map(x => x)
            .pop();
          const helperName = filename ? filename.split('.').shift() : undefined;
          if (helperName) {
            Handlebars.registerHelper(
              helperName,
              require(`./templates/helpers/${filename}`)
            );
          }
        }
      }
    );
  }

  private registerPartials() {
    const Handlebars = this.Handlebars;
    withAllFiles(
      path.resolve(__dirname, 'templates/partials'),
      (src: string, filepath: string) => {
        if (filepath !== undefined) {
          const filename = filepath.split('/').pop();
          const partialName = filename
            ? filename.split('.').shift()
            : undefined;
          if (partialName) {
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
  const targetPath = require.resolve(relPath);
  return readFileSync(targetPath, 'utf8');
};

export const require_md = (cwdPath: string) => {
  const renderer = markedStyle();
  marked.setOptions({ renderer });
  log.verbose('compile markdown', cwdPath);

  try {
    const targetPath = cwdPath.endsWith('.md') ? cwdPath : cwdPath + '.md';
    const resolvedTargetPath = path.resolve(process.cwd(), targetPath);
    const raw = readFileSync(resolvedTargetPath, 'utf8');
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

    // const chunks = raw
    //   .split(/#+.[\S ]+(?=\n)/)
    //   .map(chunk => marked(addEmojis(chunk)));
    const data = marked(addEmojis(raw));
    return {
      title,
      raw,
      data,
      chunks,
    };
  } catch (e) {
    return {
      raw: null,
      data: null,
      chunks: null,
      title: null,
      error: true,
      errorMessage: e.message,
    };
  }
};

export const addEmojis = (markdown: string) => {
  const replacer = (match: any) => emoji.emojify(match);
  return markdown.replace(/(:.*:)/g, replacer);
};

export default Compiler;
