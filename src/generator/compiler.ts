import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';

// POC generates es-modules
type Template = (data: any) => string;

export const compile = (
  contentTemplate: Template,
  data: any,
  target: string
) => {
  const layout: any = require('./templates/_layout');
  const content = contentTemplate(data);
  const withLayout = layout({ content, data });
  const targetPath = path.resolve(process.cwd(), 'docs', target);
  writeFileSync(targetPath, withLayout, 'utf8');
};
