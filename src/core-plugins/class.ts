import { NodePath } from 'babel-traverse';
import {
  Class,
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

export const key = 'class';

export default function(engine: ParseEngine, store: Store) {
  return {
    visitor: { Class: handler },
  };

  function handler(path: NodePath<Class>) {
    const file_id = getFileName(path);
    const push = store.createPush(path);
    const node = path.node;
    const class_id = node.id !== null ? node.id.name : undefined;
    const traverseFn = () => path.traverse(functionVisitor(onFunction));
    const traverseMethod = () => path.traverse(methodVisitor(onFunction));

    push({
      file_id: getFileName(path),
      jsdoc: getDocTagsFromPath(path),
      class_id,
    })
      .then(traverseFn)
      .then(traverseMethod);

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
