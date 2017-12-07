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
  SourceLocation,
  VariableDeclarator,
} from 'babel-types';

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
  getVariableId,
  getVarIdNode,
} from './helpers/getters';
import { ArrayPatternProperty, FunctionType } from './helpers/types';
import functionVisitor from './visitors/functionVisitor';

export const key = 'var';
export default function(engine: ParseEngine, store: Store): IPluginCommand {
  return {
    visitor: {
      VariableDeclarator: handleDeclarator,
    },
  };
  function onFunction(path: NodePath<FunctionType>, file_id: string) {
    const var_id = getVariableId(path.parentPath);
    if (!var_id) {
      return;
    }
    const { function_id } = getFunctionMeta(path);
    store.insert(var_id, file_id)({
      function_id,
    });
  }

  function handleDeclarator(path: NodePath<VariableDeclarator>) {
    const push = store.createPush(path as NodePath);
    const file_id = getFileName(path as NodePath);
    const afterPush = () => path.traverse(functionVisitor(onFunction), file_id);

    const id = getVarIdNode(path);
    switch (id.node.type) {
      case 'Identifier':
        push({
          file_id,
          var_id: id.node.name,
          jsdoc: getDocTagsFromPath(path as NodePath),
        }).then(afterPush);
        break;
      case 'ObjectPattern':
        id.node.properties.forEach(prop => {
          if (prop.type === 'ObjectProperty' && isIdentifier(prop.value)) {
            return push({
              file_id,
              var_id: prop.value.name,
              jsdoc: getDocTagsFromPath(path.get('id')),
            }).then(afterPush);
          }
        });
        break;
      case 'ArrayPattern':
        id.node.elements.forEach((prop: ArrayPatternProperty) => {
          if (prop.type === 'Identifier') {
            return push({
              file_id,
              var_id: prop.name,
              jsdoc: getDocTagsFromPath(path.get('id')),
            }).then(afterPush);
          }
          if (prop.type === 'RestElement' && isIdentifier(prop.argument)) {
            return push({
              file_id,
              var_id: '...' + prop.argument.name,
              jsdoc: getDocTagsFromPath(path.get('id')),
            }).then(afterPush);
          }
          return logSkipped(prop.type, prop.loc);
        });
        break;
      default:
        logSkipped(id.node.type, id.node.loc);
        break;
    }
  }
}
