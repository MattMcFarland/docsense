import { NodePath } from 'babel-traverse';

import {
  FunctionType,
  getDocTagsFromPath,
  getFileName,
  getFunctionMeta,
  getVariableId,
} from '../parser/helpers';
import ParseEngine from '../parser/ParseEngine';
import { IPluginCommand } from '../types/Plugin';
import functionVisitor from './visitors/functionVisitor';

export const collectionName = 'var_collection';
export default function(engine: ParseEngine, db: Lowdb.Lowdb): IPluginCommand {
  db.set(collectionName, []).write();
  const createPush = (path: NodePath) => (data: any) => {
    db
      .get(collectionName)
      .push(data)
      .write();
    path.traverse(functionVisitor(onFunction));
  };
  const insert = (var_id: string) => (data: any) => {
    db
      .get(collectionName)
      .find({ var_id })
      .assign(data)
      .write();
  };
  return {
    visitor: {
      VariableDeclarator: handleDeclarator,
    },
  };
  function onFunction(path: NodePath<FunctionType>) {
    const var_id = getVariableId(path.parentPath);
    if (!var_id) {
      return;
    }
    const { function_id } = getFunctionMeta(path);
    insert(var_id)({
      function_id,
    });
  }
  function handleDeclarator(path: any) {
    const file_id = getFileName(path);
    const push = createPush(path);
    switch (path.node.id.type) {
      case 'Identifier':
        push({
          file_id,
          var_id: path.node.id.name,
          jsdoc: getDocTagsFromPath(path),
        });
        break;
      case 'ObjectPattern':
        path.node.id.properties.forEach((prop: any) => {
          const var_id = prop.value.name;
          push({
            file_id,
            var_id,
            jsdoc: getDocTagsFromPath(path.get('id')),
          });
        });
        break;
      case 'ArrayPattern':
        path.node.id.elements.forEach((prop: any) => {
          if (prop.type === 'Identifier') {
            push({
              file_id,
              var_id: prop.name,
              jsdoc: getDocTagsFromPath(path.get('id')),
            });
          }
          if (prop.type === 'RestElement') {
            push({
              file_id,
              var_id: prop.argument.name,
              jsdoc: getDocTagsFromPath(path.get('id')),
            });
          }
        });
        break;
    }
  }
}
