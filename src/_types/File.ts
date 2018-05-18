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

export interface MarkdownFile extends BaseFileModel {
  kind: FileKind.Markdown;
}

export interface OtherFile extends BaseFileModel {
  kind: FileKind.Other;
}

export type FileModel =
  | TypeScriptFile
  | FlowTypeFile
  | JavascriptFile
  | MarkdownFile
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

export const isMarkdownFile = (
  fileModel: FileModel
): fileModel is MarkdownFile => {
  return fileModel.kind === FileKind.Markdown;
};

export enum FileKind {
  TypeScript = 'TypeScript',
  FlowType = 'FlowType',
  JavaScript = 'JavaScript',
  Markdown = 'Markdown',
  Other = 'Other',
}
