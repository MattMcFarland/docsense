import { readFileSync, writeFileSync } from 'fs';
import * as path from 'path';

// POC generates es-modules
type Template = (data: any) => string;

type LayoutTemplate = (
  { data, content }: { data: any; content: any }
) => string;
export const compile = (
  contentTemplate: Template,
  data: any,
  target: string
) => {
  const layout: LayoutTemplate = require('./templates/_layout');
  const content = contentTemplate(data);
  const withLayout = layout({ content, data });
  const targetPath = path.resolve(process.cwd(), 'docs', target);
  writeFileSync(targetPath, withLayout, 'utf8');
};
