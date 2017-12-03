import { NodePath, PathOrNode } from 'babel-traverse';
import {
  ArrowFunctionExpression,
  AssignmentProperty,
  ClassMethod,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  isIdentifier,
  isVariableDeclarator,
  Node,
  ObjectExpression,
  ObjectMethod,
  ObjectPattern,
  ObjectProperty,
  RestProperty,
} from 'babel-types';

import { INamedIdentifier, Parameter } from '../types/AST';
import { createHelper } from './HelperFactory';

function NodeHelpers(nodePath: NodePath<Node>) {
  return {
    getFileName: () => getFileName(nodePath),
    getDocTags: () => getDocTags(nodePath),
    getVariableId: () => getVariableId(nodePath),
  };
}

function FunctionHelpers(nodePath: NodePath<FunctionType>) {
  return {
    getFileName: () => getFileName(nodePath),
    getFunctionMeta: () => getFunctionMeta(nodePath),
    getFunctionParams: () => getFunctionParams(nodePath),
    getDocTags: () => getDocTags(nodePath),
    getVariableId: () => getVariableId(nodePath),
  };
}

function pathWrapHelper(nodePath: NodePath<Node>) {
  switch (nodePath.node.type) {
    case 'FunctionDeclaration':
    case 'ArrowFunctionExpression':
    case 'FunctionExpression':
    case 'ObjectMethod':
    case 'ClassMethod':
      return {
        ...NodeHelpers(nodePath),
        ...FunctionHelpers(nodePath as NodePath<FunctionType>),
      };
    default:
      return NodeHelpers(nodePath);
  }
}
export default pathWrapHelper;

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

export const getFunctionMeta = createHelper<FunctionType, IFunctionMeta>(
  (node: FunctionType) => {
    const { line, column } = node.loc.start;
    const location_id = `${line}:${column}`;
    const id = isIdentifier(node.id) ? node.id.name : 'anonymous';
    const function_id = id + '@' + location_id;
    const params = getFunctionParams(node) || undefined;
    const jsdoc = getDocTags(node);
    return { function_id, params, jsdoc };
  }
);
//////////////////////////////////////////////////////////////////////////////////////////
// TODO: Refactor "any" out of all the things below this line, use createHelper() too?
//////////////////////////////////////////////////////////////////////////////////////////

export function getObjectData(path: NodePath<ObjectExpression>) {
  if (path.parentPath.isAssignmentExpression()) {
    // nothing
  }
  if (path.parentPath.isVariableDeclarator()) {
    // nothing
  }
}
export type Param = string | IKeyValueDescriptor[] | string[];
export const getFunctionParamsFromNode = (node: FunctionType): Param[] => {
  return node.params.map((param: Parameter) => {
    switch (param.type) {
      case 'Identifier':
        return param.name;
      case 'ObjectPattern':
        return getObjectPatternProperties(param);
      case 'ArrayPattern':
        return param.elements.map(
          expression =>
            // because expressions can be just about anything
            isIdentifier(expression) ? expression.name : expression.type
        );
      case 'RestElement':
        return isIdentifier(param.argument)
          ? `...${param.argument.name}`
          : param.argument.type;
      case 'MemberExpression':
        return 'MemberExpression';
      case 'AssignmentPattern':
        return 'AssignmentPattern';
      default:
        return assertNever(param);
    }
  });
};

export const getFunctionParams = createHelper<
  FunctionType,
  Array<string | IKeyValueDescriptor[] | string[]>
>(getFunctionParamsFromNode);

type ObjectPatternProperty = AssignmentProperty | RestProperty;

export const getObjectPatternProperties = (node: ObjectPattern) => {
  return node.properties.map(getObjectPatternProp);
};
export interface IKeyValueDescriptor {
  key: string;
  value: string;
}
export const getObjectPatternProp = (
  prop: ObjectPatternProperty
): IKeyValueDescriptor => {
  switch (prop.type) {
    case 'ObjectProperty':
      if (isIdentifier(prop.key) && isIdentifier(prop.value)) {
        return { key: prop.key.name, value: prop.value.name };
      }
      return { key: prop.key.type, value: prop.value.type };
    case 'RestProperty':
      return isIdentifier(prop.argument)
        ? { key: `...${prop.argument.name}`, value: `...${prop.argument.name}` }
        : { key: prop.argument.type, value: prop.argument.type };
    default:
      return assertNever(prop);
  }
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

function assertNever(x: never): never {
  throw new Error('Unexpected object: ' + x);
}

export interface IFunctionMeta {
  function_id: string;
  params?: Param[];
  jsdoc: any;
}

export type FunctionType =
  | ClassMethod
  | ObjectMethod
  | ArrowFunctionExpression
  | FunctionExpression
  | FunctionDeclaration;
