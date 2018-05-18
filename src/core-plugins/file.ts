import * as Path from 'path';

import { FileKind, FileModel } from '../_types/File';
import ParseEngine from '../parser/ParseEngine';
import { encode } from '../utils/base64';

export const collectionName = 'file_collection';

export default function(engine: ParseEngine, db: Lowdb) {
  db.set(collectionName, []).write();
  engine.on('addFile', ({ fileName }) => {
    const fileModel = createFileModel(fileName);
    db
      .get(collectionName)
      .push(fileModel)
      .write();
  });
  const createFileModel = (filepath: string): FileModel => {
    const normalizedPath = Path.posix.normalize(filepath);
    const path = Path.posix.relative(engine.config.root, normalizedPath);
    const { dir, base, name, ext } = Path.posix.parse(path);
    const id = encode(`${dir}/${name}`);
    const isIndex = name === 'index';
    const rest = {
      dir,
      base,
      name,
      ext,
      id,
      path,
      isIndex,
    };
    if (kindIsFlowType(path)) {
      return {
        kind: FileKind.FlowType,
        ...rest,
      };
    }
    if (kindIsJavascript(path)) {
      return {
        kind: FileKind.JavaScript,
        ...rest,
      };
    }
    if (kindIsTypeScript(path)) {
      return {
        kind: FileKind.TypeScript,
        ...rest,
      };
    }
    return {
      kind: FileKind.Other,
      ...rest,
    };
  };

  const kindIsJavascript = (filepath: string) => {
    const { ext } = Path.parse(filepath);
    return ext === '.js' || ext === '.jsx' || ext === '.mjs';
  };

  const kindIsTypeScript = (filepath: string) => {
    const { ext } = Path.parse(filepath);
    return ext === '.ts' || ext === '.tsx';
  };

  const kindIsFlowType = (filepath: string) =>
    Array.isArray(engine.parseOptions.plugins) &&
    engine.parseOptions.plugins.includes('flow');
}
