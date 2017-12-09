import { readdirSync, readFileSync, writeFile } from 'fs';
import * as mkdirp from 'mkdirp';
import * as Path from 'path';

export const withAllFiles = (
  path: string,
  fn: (data: string, filename: string, index: number) => void
) => {
  const files = readdirSync(path);
  files.forEach((filename, index) => {
    const data = readFileSync(Path.resolve(path, filename), 'utf8');
    fn(data, filename, index);
  });
};

export const createFile = (target: string, data: string | Buffer) =>
  new Promise((resolve, reject) => {
    const dir = Path.dirname(target);

    mkdirp(dir, mkDirError => {
      if (mkDirError) return reject(mkDirError);
      writeFile(target, data, writeError => {
        if (writeError) return reject(writeError);
        if (!writeError) return resolve(true);
      });
    });
  });
