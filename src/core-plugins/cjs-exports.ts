import {
  getFileName,
  getFunctionMeta,
  getDocTags,
  isExportsIdentifier,
  IExportsIdentifier,
  isModuleExports,
  pushIfModuleExports,
} from '../parser/helpers';
import ParseEngine from '../parser/ParseEngine';
import functionVisitor from './visitors/functionVisitor';
import { NodePath } from 'babel-traverse';
import {
  Identifier,
  MemberExpression,
  Node,
  FunctionType,
  AssignmentExpression,
  isMemberExpression,
  isIdentifier,
  isObjectMember,
  ObjectMember,
} from 'babel-types';

import { ObjectExpression } from 'babel-types';

export const pluginKey = 'cjsExports';
export const collectionName = pluginKey + '_collection';
export const entryId = pluginKey + '_id';

export default function(engine: ParseEngine, db: Lowdb.Lowdb): any {
  db.set(collectionName, []).write();
  const createPush = (path: NodePath) => (data: any) => {
    db
      .get(collectionName)
      .push(data)
      .write();
    path.traverse(functionVisitor(traverseFunction), data[entryId]);
  };
  const insert = (id_val: string) => (data: any) => {
    db
      .get(collectionName)
      .find({ [entryId]: id_val })
      .assign(data)
      .write();
  };

  return {
    visitor: {
      AssignmentExpression: (path: NodePath<AssignmentExpression>) => {
        const left = path.get('left');
        if (isExportsIdentifier(left)) {
          handleExportsIdentifier(left);
        }
        if (left.isMemberExpression()) {
          handleMemberExpression(left);
        }
      },
    },
  };

  function handleExportsIdentifier(left: NodePath<IExportsIdentifier>) {
    const push = createPush(left);
    const file_id = getFileName(left);
    const jsdoc = getDocTags(left);
    const right = left.getOpposite();

    if (right.isObjectExpression()) {
      return right.node.properties.forEach(prop => {
        if (isObjectMember(prop) && isIdentifier(prop.key)) {
          push({
            [entryId]: prop.key.name,
            file_id,
            jsdoc,
          });
        }
      });
    }

    push({
      [entryId]: 'default',
      file_id,
      jsdoc,
    });
  }

  function handleMemberExpression(left: NodePath<MemberExpression>) {
    const push = createPush(left);
    const file_id = getFileName(left);
    const jsdoc = getDocTags(left);
    const right = left.getOpposite();
    const pushDefaults = () => push({ [entryId]: 'default', file_id, jsdoc });

    return pushIfModuleExports(left, pushDefaults);
  }
  function traverseFunction(path: NodePath<FunctionType>, storeId: string) {
    const { function_id /* params, jsdoc */ } = getFunctionMeta(path);
    insert(storeId)({
      function_id,
    });
  }
}
