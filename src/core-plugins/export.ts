import { NodePath } from 'babel-traverse';
import {
  ExportAllDeclaration,
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  ExportSpecifier,
  isIdentifier,
  VariableDeclarator,
} from 'babel-types';
import { Annotation } from 'doctrine';

import { IPluginCommand } from '../_types/Plugin';
import ParseEngine from '../parser/ParseEngine';
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

export const collectionName = 'export_collection';
interface IExportItem {
  export_id?: string;
  file_id?: string;
  jsdoc?: Annotation[];
  source_id?: string;
  function_id?: string;
}
export default function(engine: ParseEngine, db: Lowdb): IPluginCommand {
  db.set(collectionName, []).write();
  const createPush = (path: NodePath) => (data: IExportItem): void => {
    db
      .get(collectionName)
      .push(data)
      .write();
    path.traverse(functionVisitor(onFunction), data);
  };
  const insert = ({ export_id, file_id }: IExportItem) => (
    data: IExportItem
  ) => {
    db
      .get(collectionName)
      .find({
        export_id,
        file_id,
      })
      .assign(data)
      .write();
  };
  return {
    visitor: {
      ExportNamedDeclaration: handleExportNamedDeclaration,
      ExportSpecifier: handleExportSpecifier,
      ExportDefaultDeclaration: handleExportDefaultDeclaration,
      ExportAllDeclaration: handleExportAllDeclaration,
    },
  };
  function handleExportNamedDeclaration(
    path: NodePath<ExportNamedDeclaration>
  ) {
    if (path.node.declaration === null) {
      return;
    }
    const push = createPush(path);
    const declaration = path.node.declaration;
    switch (declaration.type) {
      case 'VariableDeclaration':
        return declaration.declarations.forEach(
          (exportDeclaration: VariableDeclarator) => {
            if (isNamedIdentifier(exportDeclaration.id)) {
              push({
                export_id: exportDeclaration.id.name,
                file_id: getFileName(path),
                jsdoc: getDocTagsFromPath(path),
              });
            }
          }
        );
      case 'FunctionDeclaration':
        if (isNamedIdentifier(declaration.id)) {
          return push({
            export_id: declaration.id.name,
            file_id: getFileName(path),
            jsdoc: getDocTagsFromPath(path),
          });
        }
      default:
        return logSkipped(declaration.type, declaration.loc);
    }
  }
  function handleExportSpecifier(path: NodePath<ExportSpecifier>) {
    const push = createPush(path);
    push({
      export_id: path.node.exported.name,
      file_id: getFileName(path),
      jsdoc: getDocTagsFromPath(path),
    });
  }
  function handleExportDefaultDeclaration(
    path: NodePath<ExportDefaultDeclaration>
  ) {
    const push = createPush(path);
    push({
      export_id: 'default',
      file_id: getFileName(path),
      jsdoc: getDocTagsFromPath(path),
    });
  }
  function handleExportAllDeclaration(path: NodePath<ExportAllDeclaration>) {
    const push = createPush(path);
    push({
      export_id: 'all',
      file_id: getFileName(path),
      source_id: path.node.source.value,
      jsdoc: getDocTagsFromPath(path),
    });
  }
  function onFunction(path: NodePath<FunctionType>, data: any) {
    const { function_id } = getFunctionMeta(path);
    insert(data)({
      function_id,
    });
  }
}
