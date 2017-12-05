import { readFileSync, writeFileSync } from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';

// POC generates es-modules
export const require_template = (relPath: string) => {
  const targetPath = path.resolve(__dirname, relPath);
  return readFileSync(targetPath, 'utf8');
};

export const layout = (page: string, data: any) => {
  const layout_source = require_template('./templates/_layout.hbs');
  const template = Handlebars.compile(layout_source);
  const result = template({ page, ...data });
  return result;
};

export const compile = (source: string, data: any, target: string) => {
  const template = Handlebars.compile(source);
  const content = template(data);
  const withLayout = layout(content, data);
  const targetPath = path.resolve(process.cwd(), 'docs', target);
  writeFileSync(targetPath, withLayout, 'utf8');
};
