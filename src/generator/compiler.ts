import { readFileSync, writeFileSync } from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';

import { makeNodeModuleStatic, withAllFiles } from './file';

export const require_template = (relPath: string) => {
  const targetPath = require.resolve(relPath);
  return readFileSync(targetPath, 'utf8');
};

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

makeNodeModuleStatic(
  'tachyons/css/tachyons.min.css',
  'docs/static/tachyons.min.css'
);
makeNodeModuleStatic(
  'highlightjs/highlight.pack.min.js',
  'docs/static/highlight.js'
);
makeNodeModuleStatic(
  'highlightjs/styles/github.css',
  'docs/static/hljs.github.css'
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