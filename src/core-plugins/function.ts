import { NodePath } from 'babel-traverse';

import ParseEngine from '../parser/ParseEngine';
import { FunctionType } from '../types/AST';
import { IPluginCommand } from '../types/Plugin';
import { getFileName, getFunctionMeta, getVariableId } from './helpers/helpers';

export const collectionName = 'function_collection';

export default function(engine: ParseEngine, db: Lowdb): IPluginCommand {
  db.set(collectionName, []).write();
  const push = (data: any) => {
    db
      .get(collectionName)
      .push(data)
      .write();
  };
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
    return push({
      function_id,
      file_id,
      var_id,
      params: params && params.length ? params : undefined,
      jsdoc,
    });
  }
}
