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
  getMethodMeta,
  getObjectId,
  getVariableId,
} from './helpers/getters';
import { FunctionType } from './helpers/types';
import functionVisitor from './visitors/functionVisitor';
import methodVisitor from './visitors/methodVisitor';

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
        path.traverse(methodVisitor(onMethod), path.node.key.name);
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
        method_id: getMethodMeta(path).method_id,
        jsdoc: getDocTagsFromPath(path.get('key')),
      });
      path.traverse(methodVisitor(onMethod), object_id);
    }

    function onMethod(fnPath: NodePath<ClassMethod>, _id: string) {
      const { method_id } = getMethodMeta(fnPath);
      store.insert(_id, file_id)({
        method_id,
      });
    }
  }
}
