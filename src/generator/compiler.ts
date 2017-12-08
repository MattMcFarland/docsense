import { readFileSync, writeFileSync } from 'fs';
import * as Handlebars from 'handlebars';
import * as marked from 'marked';
import * as emoji from 'node-emoji';
import * as path from 'path';

import { makeNodeModuleStatic, withAllFiles } from './file';

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
export function addEmojis(markdown: string) {
  const replacer = (match: any) => emoji.emojify(match);
  return markdown.replace(/(:.*:)/g, replacer);
}
require('handlebars-helpers')();
Handlebars.registerHelper('json', (context: any) =>
  JSON.stringify(context, null, 2)
);
withAllFiles(
  path.resolve(__dirname, 'templates/partials'),
  (src: string, filepath: string) => {
    if (filepath !== undefined) {
      const filename = filepath.split('/').pop();
      const partialName = filename ? filename.split('.').shift() : undefined;
      if (partialName) {
        Handlebars.registerPartial(partialName, src);
      }
    }
  }
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

export const compileLayout = (page: any, data: any) => {
  const layout_source = require_template('./templates/_layout.hbs');
  const template = Handlebars.compile(layout_source);
  const result = template({
    page,
    ...data,
  });
  return result;
};

export const compile = (source: string, data: any, target: string) => {
  const template = Handlebars.compile(source);
  const content = template(data);
  const withLayout = compileLayout(content, data);
  const targetPath = path.resolve(process.cwd(), 'docs', target);
  writeFileSync(targetPath, withLayout, 'utf8');
};
