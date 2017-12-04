import { NodePath } from 'babel-traverse';
import {
  ArrayPattern,
  AssignmentPattern,
  Identifier,
  isIdentifier,
  MemberExpression,
  Node,
  ObjectPattern,
  RestElement,
  VariableDeclarator,
} from 'babel-types';

import ParseEngine from '../parser/ParseEngine';
import { IPluginCommand } from '../types/Plugin';
import { log } from '../utils/logger';
import {
  assertNever,
  getDocTagsFromPath,
  getFileName,
  getFunctionMeta,
  getVariableId,
  getVarIdNode,
} from './helpers/getters';
import { ArrayPatternProperty, FunctionType } from './helpers/types';
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

  function handleDeclarator(path: NodePath<VariableDeclarator>) {
    const push = createPush(path as NodePath);
    const file_id = getFileName(path as NodePath);

    const id = getVarIdNode(path);
    switch (id.node.type) {
      case 'Identifier':
        return push({
          file_id,
          var_id: id.node.name,
          jsdoc: getDocTagsFromPath(path as NodePath),
        });
      case 'ObjectPattern':
        return id.node.properties.forEach(prop => {
          if (prop.type === 'ObjectProperty' && isIdentifier(prop.value)) {
            return push({
              file_id,
              var_id: prop.value.name,
              jsdoc: getDocTagsFromPath(path.get('id')),
            });
          }
        });
      case 'ArrayPattern':
        return id.node.elements.forEach((prop: ArrayPatternProperty) => {
          if (prop.type === 'Identifier') {
            return push({
              file_id,
              var_id: prop.name,
              jsdoc: getDocTagsFromPath(path.get('id')),
            });
          }
          if (prop.type === 'RestElement' && isIdentifier(prop.argument)) {
            return push({
              file_id,
              var_id: '...' + prop.argument.name,
              jsdoc: getDocTagsFromPath(path.get('id')),
            });
          }
          return log.warn(
            'skip',
            prop.type,
            `${file_id}:${prop.loc.start.line}:${prop.loc.start.column}`
          );
        });
      default:
        return log.warn(
          'skip',
          id.node.type,
          `${file_id}:${id.node.loc.start.line}:${id.node.loc.start.column}`
        );
    }
  }
}
