import ParseEngine from '../parser/ParseEngine';
import helpers, { getFunctionMeta, IFunctionMeta } from '../parser/helpers';
import { log } from '../utils/logger';
import functionVisitor from './visitors/functionVisitor';
import { NodePath } from 'babel-traverse';
import { IPluginCommand } from '../types/Plugin';
export const collectionName = 'export_collection';
interface IExportItem {
  export_id: string;
  file_id?: string;
  jsdoc?: any;
  source_id?: string;
}
export default function(engine: ParseEngine, db: Lowdb): IPluginCommand {
  db.set(collectionName, []).write();
  const createPush = (path: any) => (data: IExportItem): void => {
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
  function handleExportNamedDeclaration(path: NodePath) {
    const push = createPush(path);
    if (path.node.specifiers.length) {
      return;
    }
    const { getFileName, getDocTags } = helpers(path);
    const declarations = path.get('declaration.declarations');
    if (declarations && typeof declarations.forEach === 'function') {
      return declarations.forEach((exportDeclaration: NodePath) => {
        push({
          export_id: exportDeclaration.node.id.name,
          file_id: getFileName(),
          jsdoc: getDocTags(),
        });
      });
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
  function handleExportSpecifier(path) {
    const push = createPush(path);
    const { getFileName, getDocTags } = helpers(path);
    push({
      export_id: path.get('exported.name').node,
      file_id: getFileName(),
      jsdoc: getDocTags(),
    });
  }
  function handleExportDefaultDeclaration(path) {
    const push = createPush(path);
    const { getFileName, getDocTags } = helpers(path);
    push({
      export_id: 'default',
      file_id: getFileName(),
      jsdoc: getDocTags(),
    });
  }
  function handleExportAllDeclaration(path) {
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
