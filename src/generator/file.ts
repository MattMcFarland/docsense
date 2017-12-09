import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve as resolvePath } from 'path';

export const withAllFiles = (
  path: string,
  fn: (data: string, filename: string, index: number) => void
) => {
  const files = readdirSync(path);
  files.forEach((filename, index) => {
    const data = readFileSync(resolvePath(path, filename), 'utf8');
    fn(data, filename, index);
  });
};

export const makeNodeModuleStatic = (require_module: string, dist: string) => {
  const data = readFileSync(require.resolve(require_module), 'utf8');
  writeFileSync(resolvePath(dist), data, 'utf8');
  return true;
};
