import { NodePath, PathOrNode } from 'babel-traverse';
import {
  ArrowFunctionExpression,
  AssignmentProperty,
  ClassMethod,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  isIdentifier,
  isMemberExpression,
  isRestElement,
  isVariableDeclarator,
  Node,
  ObjectExpression,
  ObjectMethod,
  ObjectPattern,
  ObjectProperty,
  RestElement,
  RestProperty,
} from 'babel-types';
import { Annotation } from 'doctrine';

import { INamedIdentifier, Parameter } from '../types/AST';
import { createHelper } from './HelperFactory';

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

export const getFunctionMeta = (path: NodePath<FunctionType>) => {
  const node = path.node;
  const { line, column } = node.loc.start;
  const location_id = `${line}:${column}`;
  const id = isIdentifier(node.id) ? node.id.name : 'anonymous';
  const function_id = id + '@' + location_id;
  const params = getFunctionParams(path);
  const jsdoc = getDocTagsFromPath(path);
  return { function_id, params, jsdoc };
};

export function getDocTagsFromPath(path: NodePath): Annotation[] | undefined {
  const tags =
    path.node.__doc_tags__ ||
    path.getStatementParent().node.__doc_tags__ ||
    path.parent.__doc_tags__;
  return tags && tags.length ? tags : undefined;
}

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
          expression => {
            if (expression === null) return 'null';
            if (isRestElement(expression))
              return getRestElementProps(expression);
            return isIdentifier(expression) ? expression.name : expression.type;
          }
          // because expressions can be just about anything
        );
      case 'RestElement':
        return getRestElementProps(param);
      case 'MemberExpression':
        return 'MemberExpression';
      case 'AssignmentPattern':
        return 'AssignmentPattern';
      default:
        return assertNever(param);
    }
  });
};
export const getRestElementProps = (rest: RestElement) => {
  switch (rest.argument.type) {
    case 'MemberExpression':
      return 'MemberExpression';
    case 'Identifier':
      return `...${rest.argument.name}`;
    case 'RestElement':
      return 'RestElement';
    case 'AssignmentPattern':
      return 'AssignmentPattern';
    case 'ObjectPattern':
      return 'ObjectPattern';
    case 'ArrayPattern':
      return 'ArrayPattern';
    default:
      return assertNever(rest.argument);
  }
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

export function isNamedIdentifier(node: Node): node is INamedIdentifier {
  return isIdentifier(node) && node.name !== undefined;
}

function assertNever(x: never): never {
  throw new Error('Unexpected object: ' + x);
}

export interface IFunctionMeta {
  function_id: string;
  params?: Param[];
  jsdoc: Annotation[];
}

export type FunctionType =
  | ClassMethod
  | ObjectMethod
  | ArrowFunctionExpression
  | FunctionExpression
  | FunctionDeclaration;
