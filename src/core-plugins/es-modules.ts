import { NodePath } from 'babel-traverse';
import {
  ExportAllDeclaration,
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  ExportSpecifier,
  Identifier,
  isIdentifier,
  VariableDeclarator,
} from 'babel-types';
import { Annotation } from 'doctrine';

import { IPluginCommand } from '../_types/Plugin';
import ParseEngine from '../parser/ParseEngine';
import Store from '../store';
import { log } from '../utils/logger';
import { logSkipped } from './helpers/effects';
import {
  assertNever,
  getDocTagsFromPath,
  getFileName,
  getFunctionMeta,
  isNamedIdentifier,
} from './helpers/getters';
import { FunctionType } from './helpers/types';
import functionVisitor from './visitors/functionVisitor';

export const collectionName = 'esModule_collection';

interface ESModuleSchema {
  esModule_id: string;
  jsdoc?: Annotation[];
}
interface IExportItem {
  export_id?: string;
  file_id?: string;
  jsdoc?: Annotation[];
  source_id?: string;
  function_id?: string;
}
export const key = 'esModule';
export default (engine: ParseEngine, store: Store): any => {
  return {
    visitor: {
      ExportNamedDeclaration: exportNamedDeclaration,
      ExportSpecifier: exportSpecifier,
      ExportDefaultDeclaration: exportDefaultDeclaration,
      ExportAllDeclaration: exportAllDeclaration,
      ReferencedIdentifier: referencedIdentifier,
    },
  };
  function referencedIdentifier(path: NodePath<Identifier>, state: any) {
    state.foo = 'bar';
    path.stop();
  }
  function exportNamedDeclaration(path: NodePath<ExportNamedDeclaration>) {}
  function exportSpecifier(path: NodePath<ExportSpecifier>) {}
  function exportDefaultDeclaration(
    path: NodePath<ExportDefaultDeclaration>,
    state: any
  ) {
    const push = store.createPush(path);
    switch (path.node.declaration.type) {
      case 'FunctionDeclaration':
      case 'ArrowFunctionExpression':
        // exporting a function
        const functionPath = path.get('declaration') as NodePath<FunctionType>;
        push({
          file_id: getFileName(path),
          function_id: getFunctionMeta(functionPath).function_id,
          export_id: 'default',
        });
        break;
      case 'Identifier':
        const idPath = path.get('declaration') as NodePath<Identifier>;
        const refName = idPath.node.name;

        break;
    }
  }
  function exportAllDeclaration(path: NodePath<ExportAllDeclaration>) {}
};
