import * as Path from 'path';

import { Lowdb } from '../../storage/db';
import { encode } from '../../utils/base64';
import ParseEngine from '../ParseEngine';

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
    const {
      dir,
      // root: file_root,
      base,
      name,
      ext,
    } = Path.posix.parse(path);
    const id = encode(`${dir}/${name}`);
    const isIndex = name === 'index';
    const rest = {
      dir,
      // file_root,
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

  const getFileKindFromPath = (filepath: string): FileKind => {
    if (kindIsFlowType(filepath)) return FileKind.FlowType;
    if (kindIsJavascript(filepath)) return FileKind.JavaScript;
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
  TypeScript = 'TypeScript',
  FlowType = 'FlowType',
  JavaScript = 'JavaScript',
  Other = 'Other',
}

export interface BaseFileModel {
  /**
   * Kind of file,
   * `"TypeScript"`, `"FlowType"`, `"JavaScript"`, or `"Other"`
   */
  kind: FileKind;

  /**
   * A Unique Identifier for the file, considered its primary key,
   * e.g.: `xc8v7wsejkfn==`
   */
  id: string;

  /**
   * Full path to the file,
   * e.g: `foo/bar/myFile.xyz` from `foo/bar/myFile.xyz`
   */
  path: string;

  /**
   * Directory Path to the file,
   * e.g.: `foo/bar` from `foo/bar/myFile.xyz`
   */
  dir: string;

  /**
   * File name with its extension,
   * e.g.: `myFile.xyz` from `foo/bar/myFile.xyz`
   */
  base: string;

  /**
   * File name without its extension,
   * e.g.: `MyFile` from `foo/bar/myFile.xyz`
   */
  name: string;

  /**
   * File name without its extension,
   * e.g.: `.xyz` from `foo/bar/myFile.xyz`
   */
  ext: string;

  /** File with any kind of extension is named `index` */
  isIndex: boolean;
}

export interface TypeScriptFile extends BaseFileModel {
  kind: FileKind.TypeScript;
}

export interface FlowTypeFile extends BaseFileModel {
  kind: FileKind.FlowType;
}

export interface JavascriptFile extends BaseFileModel {
  kind: FileKind.JavaScript;
}

export interface OtherFile extends BaseFileModel {
  kind: FileKind.Other;
}

export type FileModel =
  | TypeScriptFile
  | FlowTypeFile
  | JavascriptFile
  | OtherFile;

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
  return fileModel.kind === FileKind.JavaScript;
};
