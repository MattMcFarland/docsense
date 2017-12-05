import { NodePath } from 'babel-traverse';
import { Class } from 'babel-types';

import ParseEngine from '../parser/ParseEngine';
import Store from '../store';
import {
  getDocTagsFromPath,
  getFileName,
  getFunctionMeta,
} from './helpers/getters';
import { FunctionType } from './helpers/types';

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

    push({
      file_id: getFileName(path),
      jsdoc: getDocTagsFromPath(path),
      class_id,
    });
  }
}
