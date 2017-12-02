import { NodePath } from 'babel-traverse';
import {
  ExportAllDeclaration,
  ExportDefaultDeclaration,
  ExportNamedDeclaration,
  ExportSpecifier,
  VariableDeclaration,
  VariableDeclarator,
} from 'babel-types';
import helpers, {
  getFunctionMeta,
  IFunctionMeta,
  isNamedIdentifier,
} from '../parser/helpers';
import ParseEngine from '../parser/ParseEngine';
import { IPluginCommand } from '../types/Plugin';
import { log } from '../utils/logger';
import functionVisitor from './visitors/functionVisitor';

export const collectionName = 'export_collection';
interface IExportItem {
  export_id: string;
  file_id?: string;
  jsdoc?: any;
  source_id?: string;
}
export default function(engine: ParseEngine, db: Lowdb): IPluginCommand {
  db.set(collectionName, []).write();
  const createPush = (path: any) => (data: any): void => {
    db
      .get(collectionName)
      .push(data)
      .write();
    path.traverse(functionVisitor(onFunction), data.export_id);
  };
  const insert = (export_id: string) => (data: any) => {
    db
      .get(collectionName)
      .find({ export_id })
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
    const push = createPush(path);
    if (path.node.specifiers.length) {
      return;
    }
    const { getFileName, getDocTags } = helpers(path);
    const declaration = path.get('declaration');

    if (declaration.isVariableDeclaration()) {
      return declaration.node.declarations.forEach(
        (exportDeclaration: VariableDeclarator) => {
          if (isNamedIdentifier(exportDeclaration.id)) {
            push({
              export_id: exportDeclaration.id.name,
              file_id: getFileName(),
              jsdoc: getDocTags(),
            });
          }
        }
      );
    }
    if (
      path.node.declaration &&
      path.node.declaration.type === 'FunctionDeclaration'
    ) {
      return push({
        export_id: path.node.declaration.id.name,
        file_id: getFileName(),
        jsdoc: getDocTags(),
      });
    }
    log.warn('export', 'skipped ExportNamedDeclaration', getFileName());
  }
  function handleExportSpecifier(path: NodePath<ExportSpecifier>) {
    const push = createPush(path);
    const { getFileName, getDocTags } = helpers(path);
    push({
      export_id: path.get('exported.name').node,
      file_id: getFileName(),
      jsdoc: getDocTags(),
    });
  }
  function handleExportDefaultDeclaration(
    path: NodePath<ExportDefaultDeclaration>
  ) {
    const push = createPush(path);
    const { getFileName, getDocTags } = helpers(path);
    push({
      export_id: 'default',
      file_id: getFileName(),
      jsdoc: getDocTags(),
    });
  }
  function handleExportAllDeclaration(path: NodePath<ExportAllDeclaration>) {
    const push = createPush(path);
    const { getFileName, getDocTags } = helpers(path);
    push({
      export_id: 'all',
      file_id: getFileName(),
      source_id: path.get('source.value').node,
      jsdoc: getDocTags(),
    });
  }
  function onFunction(path, export_id) {
    if (typeof export_id !== 'string') {
      return;
    }
    const { function_id }: IFunctionMeta = getFunctionMeta(path);
    insert(export_id)({
      function_id,
    });
  }
}
