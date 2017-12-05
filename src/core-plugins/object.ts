import { NodePath } from 'babel-traverse';
import { Class, ObjectExpression } from 'babel-types';

import ParseEngine from '../parser/ParseEngine';
import Store from '../store';
import {
  getDocTagsFromPath,
  getFileName,
  getObjectId,
  getVariableId,
} from './helpers/getters';
import { FunctionType } from './helpers/types';

export const key = 'object';

export default function(engine: ParseEngine, store: Store) {
  return {
    visitor: { ObjectExpression: handler },
  };

  function handler(path: NodePath<ObjectExpression>) {
    const file_id = getFileName(path);
    const push = store.createPush(path);
    const node = path.node;
    const entryId =
      getVariableId(path.parentPath) || getObjectId(path.parentPath);
    push({
      file_id,
      [store.entryId]: entryId,
      jsdoc: getDocTagsFromPath(path),
    });
  }
}
