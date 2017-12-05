import { NodePath } from 'babel-traverse';

import { FunctionType } from '../_types/AST';
import { IPluginCommand } from '../_types/Plugin';
import ParseEngine from '../parser/ParseEngine';
import Store from '../store';
import { getFileName, getFunctionMeta, getVariableId } from './helpers/getters';

export const key = 'function';

export default function(engine: ParseEngine, store: Store): IPluginCommand {
  return {
    visitor: {
      ArrowFunctionExpression: handler,
      FunctionExpression: handler,
      FunctionDeclaration: handler,
    },
  };
  function handler(path: NodePath<FunctionType>) {
    const file_id = getFileName(path);
    const var_id = getVariableId(path.parent);
    const { function_id, params, jsdoc } = getFunctionMeta(path);
    store.createPush(path)({
      [store.entryId]: function_id,
      file_id,
      var_id,
      params: params && params.length ? params : undefined,
      jsdoc,
    });
  }
}
