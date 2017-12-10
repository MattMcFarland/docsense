import * as Path from 'path';

import ParseEngine from '../parser/ParseEngine';
import { encode } from '../utils/base64';
import { assertNever } from './helpers/getters';

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
    const file_path = Path.posix.normalize(filepath);
    const {
      dir: file_dir,
      root: file_root,
      base: file_base,
      name: file_name,
      ext: file_ext,
    } = Path.posix.parse(file_path);
    const file_id = encode(`${file_dir}/${file_name}`);
    const isIndex = file_name === 'index';
    const rest = {
      file_dir,
      file_root,
      file_base,
      file_name,
      file_ext,
      file_id,
      file_path,
      isIndex,
    };
    if (kindIsFlowType(file_path)) {
      return {
        kind: FileKind.FlowType,
        ...rest,
      };
    }
    if (kindIsJavascript(file_path)) {
      return {
        kind: FileKind.Javascript,
        ...rest,
      };
    }
    if (kindIsTypeScript(file_path)) {
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

  const getFileKindFromPath = (filepath: string): FileKind => {
    if (kindIsFlowType(filepath)) return FileKind.FlowType;
    if (kindIsJavascript(filepath)) return FileKind.Javascript;
    if (kindIsTypeScript(filepath)) return FileKind.TypeScript;
    return FileKind.Other;
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

export enum FileKind {
  TypeScript,
  FlowType,
  Javascript,
  Other,
}
type OneOfFileKind =
  | FileKind.TypeScript
  | FileKind.FlowType
  | FileKind.Javascript
  | FileKind.Other;
export interface BaseFileModel {
  kind: FileKind;
  file_id: string;
  file_path: string;
  file_dir: string;
  file_root: string;
  file_base: string;
  file_name: string;
  file_ext: string;
  isIndex: boolean;
}

export interface TypeScriptFile extends BaseFileModel {
  kind: FileKind.TypeScript;
}

export interface FlowTypeFile extends BaseFileModel {
  kind: FileKind.FlowType;
}

export interface JavascriptFile extends BaseFileModel {
  kind: FileKind.Javascript;
}

export interface OtherFile extends BaseFileModel {
  kind: FileKind.Other;
}

type FileModel = TypeScriptFile | FlowTypeFile | JavascriptFile | OtherFile;

export const isTypeScriptFile = (
  fileModel: FileModel
): fileModel is TypeScriptFile => {
  return fileModel.kind === FileKind.TypeScript;
};

export const isFlowTypeFile = (
  fileModel: FileModel
): fileModel is FlowTypeFile => {
  return fileModel.kind === FileKind.FlowType;
};

export const isJavascriptFile = (
  fileModel: FileModel
): fileModel is JavascriptFile => {
  return fileModel.kind === FileKind.Javascript;
};
