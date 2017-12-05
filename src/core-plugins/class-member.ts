import { NodePath } from 'babel-traverse';
import {
  Class,
  ClassMethod,
  ClassProperty,
  isIdentifier,
  ObjectExpression,
  ObjectMember,
} from 'babel-types';

import ParseEngine from '../parser/ParseEngine';
import Store from '../store';
import {
  getDocTagsFromPath,
  getFileName,
  getFunctionMeta,
  getObjectId,
  getVariableId,
} from './helpers/getters';
import { FunctionType } from './helpers/types';
import functionVisitor from './visitors/functionVisitor';

export const key = 'classMember';

type ClassMember = ClassProperty | ClassMethod;

export default function(engine: ParseEngine, store: Store) {
  return {
    visitor: {
      ClassProperty: handler,
      ClassMethod: handler,
    },
  };

  function handler(path: NodePath<ClassMember>) {
    const file_id = getFileName(path);
    const push = store.createPush(path);
    const node = path.node;

    const object_id =
      getVariableId(path.parentPath.parentPath) ||
      getObjectId(path.parentPath.parentPath);

    if (path.isClassProperty()) {
      if (isIdentifier(path.node.key)) {
        push({
          object_id,
          [store.entryId]: path.node.key.name,
          file_id,
          jsdoc: getDocTagsFromPath(path.get('key')),
        });
        path.traverse(functionVisitor(onFunction), path.node.key.name);
      }
    }
    if (path.isClassMethod()) {
      const id = isIdentifier(path.node.key)
        ? path.node.key.name
        : isIdentifier(path.node.id) ? path.node.id.name : undefined;
      push({
        object_id,
        [store.entryId]: id,
        file_id,
        function_id: getFunctionMeta(path).function_id,
        jsdoc: getDocTagsFromPath(path.get('key')),
      });
      path.traverse(functionVisitor(onFunction), object_id);
    }

    function onFunction(fnPath: NodePath<FunctionType>, _id: string) {
      const { function_id } = getFunctionMeta(fnPath);
      store.insert(_id)({
        function_id,
      });
    }
  }
}
