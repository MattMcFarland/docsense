import { NodePath } from 'babel-traverse';

import helpers, { IFunctionMeta } from '../parser/helpers';
import ParseEngine from '../parser/ParseEngine';
import { IPluginCommand } from '../types/Plugin';

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
  function handler(path: NodePath) {
    const { getFileName, getFunctionMeta } = helpers(path);
    const file_id = getFileName();
    const var_id = getVariableId(path);
    const { function_id, params, jsdoc }: IFunctionMeta = getFunctionMeta();
    return push({
      function_id,
      file_id,
      var_id,
      params: params && params.length ? params : undefined,
      jsdoc,
    });
  }
}

function getVariableId(path: NodePath) {
  if (path.parentPath.isVariableDeclarator()) {
    return path.parentPath.get('id').node;
  }
}
