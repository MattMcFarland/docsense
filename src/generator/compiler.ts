import { readFileSync } from 'fs';

import * as marked from 'marked';
import * as emoji from 'node-emoji';
import * as path from 'path';

import { createFile, withAllFiles } from '../utils/file';

class Compiler {
  private Handlebars: typeof Handlebars;

  constructor() {
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
    const targetPath = path.resolve(process.cwd(), 'docs', target);
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
    Handlebars.registerHelper('json', (context: any) =>
      JSON.stringify(context, null, 2)
    );
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

export const compile = (source: string, data: any, target: string) => {
  const compiler = new Compiler();
  return compiler.compile(source, data, target);
};

export const require_template = (relPath: string) => {
  const targetPath = require.resolve(relPath);
  return readFileSync(targetPath, 'utf8');
};

export const require_md = (cwdPath: string) => {
  const targetPath = require.resolve(
    path.resolve(process.cwd(), cwdPath + '.md')
  );
  try {
    return readFileSync(targetPath, 'utf8');
  } catch (e) {
    return;
  }
};

export const addEmojis = (markdown: string) => {
  const replacer = (match: any) => emoji.emojify(match);
  return markdown.replace(/(:.*:)/g, replacer);
};
