import { NodePath, PathOrNode } from 'babel-traverse';
import {
  ArrowFunctionExpression,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  isIdentifier,
  isVariableDeclarator,
  Node,
  ObjectExpression,
} from 'babel-types';

import { createHelper } from './HelperFactory';

export default (pathObj: any) => ({
  getFileName: (): string => getFileName(pathObj),
  getFunctionMeta: (): IFunctionMeta => getFunctionMeta(pathObj),
  getFunctionParams: (): any[] => getFunctionParams(pathObj),
  getDocTags: (): any => getDocTags(pathObj),
  getVariableId: (): string | void => getVariableId(pathObj),
});

export const getFileName = createHelper<Node, string>(
  (node: Node) => node.loc.filename
);

export const getVariableId = createHelper<Node, string | void>(
  (node: Node) =>
    isVariableDeclarator(node) && isIdentifier(node.id)
      ? getIdentifierName(node.id)
      : undefined
);

export const getIdentifierName = createHelper<Identifier, string | void>(
  (node: Identifier) => (isNamedIdentifier(node) && node.name) || undefined
);

//////////////////////////////////////////////////////////////////////////////////////////
// TODO: Refactor "any" out of all the things below this line, use createHelper() too?
//////////////////////////////////////////////////////////////////////////////////////////

export function getFunctionMeta(path: any): IFunctionMeta {
  const line = path.get('loc.start.line').node;
  const column = path.get('loc.start.column').node;
  const id = path.get('id').node;
  const location_id = `${line}:${column}`;
  const function_id =
    (id ? path.get('id.name').node : 'anonymous') + '@' + location_id;
  const params = getFunctionParams(path);
  const jsdoc = getDocTags(path);
  return {
    function_id,
    params: params && params.length ? params : undefined,
    jsdoc,
  };
}
export function getObjectData(path: NodePath<ObjectExpression>) {
  if (path.parentPath.isAssignmentExpression()) {
    // nothing
  }
  if (path.parentPath.isVariableDeclarator()) {
    // nothing
  }
}
export const getFunctionParams = (path: any): any[] => {
  return path.node.params.map(param => {
    if (param.type === 'Identifier') {
      return param.name;
    }
    if (param.type === 'ObjectPattern') {
      return param.properties.map(({ key, value }) => ({
        key: key.name,
        value: value.name,
      }));
    }
    if (param.type === 'ArrayPattern') {
      return param.elements.map(el => {
        if (el) {
          if (el.type === 'Identifier') {
            return el.name;
          }
          if (el.type === 'RestElement') {
            return '...' + el.argument.name;
          }
        }
        return null;
      });
    }
    if (param.type === 'RestElement') {
      return '...' + param.argument.name;
    }
  });
};

export function getDocTags(path: any): any {
  const tags =
    path.node.__doc_tags__ ||
    path.getStatementParent().node.__doc_tags__ ||
    path.parent.__doc_tags__;
  return tags && tags.length ? tags : undefined;
}

export function isNamedIdentifier(node: Node): node is INamedIdentifier {
  return isIdentifier(node) && node.name !== undefined;
}

export interface INamedIdentifier extends Identifier {
  name: string;
}

export interface IFunctionMeta {
  function_id: string;
  params?: any[];
  jsdoc: any;
}

export type FunctionType =
  | ArrowFunctionExpression
  | FunctionExpression
  | FunctionDeclaration;
