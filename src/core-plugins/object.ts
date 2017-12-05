import { NodePath } from 'babel-traverse';
import {
  isIdentifier,
  ObjectExpression,
  ObjectMethod,
  ObjectProperty,
  SpreadProperty,
} from 'babel-types';

import ParseEngine from '../parser/ParseEngine';
import Store from '../store';
import {
  assertNever,
  getDocTagsFromPath,
  getFileName,
  getFunctionMeta,
  isNamedIdentifier,
} from './helpers/getters';
import { FunctionType } from './helpers/types';
import functionVisitor from './visitors/functionVisitor';
import methodVisitor from './visitors/methodVisitor';

export const key = 'object';

export default function(engine: ParseEngine, store: Store) {
  return {
    visitor: { ObjectExpression: handler },
  };

  function handler(path: NodePath<ObjectExpression>) {
    const file_id = getFileName(path);
    const push = store.createPush(path);
    const node = path.node;
    const var_id = node.id !== null ? node.id.name : undefined;
    const traverseFn = () => path.traverse(functionVisitor(onFunction));
    const traverseMethod = () => path.traverse(methodVisitor(onFunction));
    node.properties.forEach(parseObjectProperty);

    type ObjectPropType = ObjectProperty | ObjectMethod | SpreadProperty;

    function parseObjectProperty(prop: ObjectPropType) {
      switch (prop.type) {
        case 'ObjectProperty':
          if (isNamedIdentifier(prop.key)) {
            push({
              var_id,
              [store.entryId]: prop.key.name,
              file_id,
              jsdoc: getDocTagsFromPath(path),
            }).then(traverseFn);
          }
          break;
        case 'ObjectMethod':
          const methodId = isNamedIdentifier(prop.id)
            ? prop.id.name
            : isNamedIdentifier(prop.key) ? prop.key.name : undefined;
          if (methodId) {
            push({
              var_id,
              [store.entryId]: methodId,
              file_id,
              jsdoc: getDocTagsFromPath(path),
            }).then(traverseMethod);
          }
          break;
        case 'SpreadProperty':
          // skipping this for now...
          break;
        default:
          assertNever(prop);
          break;
      }
    }

    function onFunction(fnPath: NodePath<FunctionType>, id: string) {
      if (!id) {
        return;
      }
      const { function_id /* params, jsdoc */ } = getFunctionMeta(fnPath);
      store.insert(id)({
        function_id,
      });
    }
  }
}
