import { NodePath } from 'babel-traverse';
import { ObjectExpression } from 'babel-types';

import { IFunctionMeta } from '../parser/helpers';
import ParseEngine from '../parser/ParseEngine';
import { IPluginCommand } from '../types/Plugin';

export const collectionName = 'object_collection';

export default function(engine: ParseEngine, db: Lowdb) {
  // db.set(collectionName, []).write();
  // const push = (data: any) => {
  //   db
  //     .get(collectionName)
  //     .push(data)
  //     .write();
  // };
  // return {
  //   visitor: {
  //     ObjectExpression: handler,
  //   },
  // };
  // function handler(path: NodePath<ObjectExpression>) {
  //   const { getFileName, getObjectData } = helpers(path);
  //   const file_id = getFileName();
  //   const { object_id, jsdoc, object_methods, object_props } = getObjectData(
  //     path
  //   );
  //   return push({
  //     object_id,
  //     file_id,
  //     object_methods,
  //     object_props,
  //     jsdoc,
  //   });
  // }
}
