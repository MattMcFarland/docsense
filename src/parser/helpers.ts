import { cond } from '@typed/logic';

import { NodePath, PathOrNode } from 'babel-traverse';
import {
  Identifier,
  isIdentifier,
  isMemberExpression,
  isObjectMember,
  MemberExpression,
  Node,
  NodeTypes,
  ObjectExpression,
  ObjectMember,
  VariableDeclarator,
} from 'babel-types';

export default (pathObj: any) => ({
  getFileName: (): string => getFileName(pathObj),
  getFunctionMeta: (): IFunctionMeta => getFunctionMeta(pathObj),
  getFunctionParams: (): any[] => getFunctionParams(pathObj),
  getDocTags: (): any => getDocTags(pathObj),
  getVariableId: (): string | void => getVariableId(pathObj),
});

export const getFileName = (path: any): string =>
  path.node && path.node.loc && path.node.loc.filename;

export interface IFunctionMeta {
  function_id: string;
  params?: any[];
  jsdoc: any;
}
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
export function isPath(prop: PathOrNode): prop is NodePath {
  return (prop as NodePath).node !== undefined;
}
export function isNode(prop: PathOrNode): prop is Node {
  return (prop as Node).start !== undefined;
}
export function getVariableId(prop: PathOrNode): string | void {
  if (isPath(prop)) return getVariableIdFromPath(prop);
  if (isNode(prop)) return getVariableIdFromNode(prop);
}
export function getVariableIdFromNode(node: Node) {
  return 'test';
}
export function getVariableIdFromPath(node: NodePath<Node>) {
  return 'test';
}

export interface IModuleDotExports extends MemberExpression {
  object: { name: 'module' } & Identifier;
  property: { name: 'exports' } & Identifier;
}

export interface ISingleDotExpression extends MemberExpression {
  object: Identifier;
  property: Identifier;
}

export function isSingleDotExpression(
  node: Node
): node is ISingleDotExpression {
  return (
    isMemberExpression(node) &&
    isIdentifier(node.object) &&
    isIdentifier(node.property)
  );
}
export function isModuleExports(node: Node): node is IModuleDotExports {
  return (
    isSingleDotExpression(node) &&
    node.object.name === 'module' &&
    node.property.name === 'exports'
  );
}
export interface INamedIdentifier extends Identifier {
  name: string;
}

export const pushIfModuleExports = (
  p: NodePath<Node>,
  pushFn: any,
  id: string = 'default'
) => {
  const objNode = p.get('object').node;

  if (!p.isMemberExpression()) return;
  if (isModuleExports(p.node)) return pushFn();

  return pushIfModuleExports(p.get('object'), () => pushFn(id), id);
};

/**
 * Because not all Identifiers can be named.
 * @param node Node
 */
export function isNamedIdentifier(node: Node): node is INamedIdentifier {
  return isIdentifier(node) && node.name !== undefined;
}
