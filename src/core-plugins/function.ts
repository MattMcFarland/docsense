import ParseEngine from '../parser/ParseEngine';
import helpers, { FunctionMeta } from '../parser/helpers';
import { Command } from 'src/types/Plugin';
export const collectionName = 'function_collection';

export default function(engine: ParseEngine, db: Lowdb): Command {
  db.set(collectionName, []).write();
  const push = data => {
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
  function handler(path) {
    const { getFileName, getFunctionMeta } = helpers(path);
    const file_id = getFileName();
    const var_id = getVariableId(path);
    const { function_id, params, jsdoc }: FunctionMeta = getFunctionMeta();
    return push({
      function_id,
      file_id,
      var_id,
      params: params && params.length ? params : undefined,
      jsdoc,
    });
  }
}

function getVariableId(path) {
  return path.parentPath.isVariableDeclarator()
    ? path.parent.id.name
    : undefined;
}
