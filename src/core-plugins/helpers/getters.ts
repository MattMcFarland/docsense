import { NodePath } from 'babel-traverse';
import * as t from 'babel-types';
import { Annotation } from 'doctrine';

import { INamedIdentifier, Parameter } from '../../_types/AST';
import { createHelper } from './HelperFactory';
import { FunctionType, IKeyValueDescriptor, Param, VarIDNode } from './types';

export const getFileName = createHelper<t.Node, string>(
  (node: t.Node) => node.loc.filename
);

export const getVariableId = createHelper<t.Node, string | void>(
  (node: t.Node) =>
    t.isVariableDeclarator(node) && t.isIdentifier(node.id)
      ? getIdentifierName(node.id)
      : undefined
);

export const getIdentifierName = createHelper<t.Identifier, string | void>(
  (node: t.Identifier) => (isNamedIdentifier(node) && node.name) || undefined
);

export const getFunctionMeta = (path: NodePath<FunctionType>) => {
  const node = path.node;
  const { line, column } = node.loc.start;
  const location_id = `${line}:${column}`;
  const id = t.isIdentifier(node.id) ? node.id.name : 'anonymous';
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

export function getObjectData(path: NodePath<t.ObjectExpression>) {
  if (path.parentPath.isAssignmentExpression()) {
    // nothing
  }
  if (path.parentPath.isVariableDeclarator()) {
    // nothing
  }
}
export const getFunctionParamsFromNode = (node: FunctionType): Param[] => {
  return node.params.map((param: Parameter) => {
    switch (param.type) {
      case 'Identifier':
        return param.name;
      case 'ObjectPattern':
        return getObjectPatternProperties(param);
      case 'ArrayPattern':
        return param.elements.map(expression => {
          // because expressions can be just about anything
          if (expression === null) return 'null';
          if (t.isRestElement(expression))
            return getRestElementProps(expression);
          return t.isIdentifier(expression) ? expression.name : expression.type;
        });
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
export const getRestElementProps = (rest: t.RestElement) => {
  switch (rest.argument.type) {
    case 'MemberExpression':
      return 'MemberExpression';
    case 'Identifier':
      return `...${rest.argument.name}`;
    case 'RestElement':
      // todo: recursion may apply here.
      // return getRestElementProps(rest)
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

type ObjectPatternProperty = t.AssignmentProperty | t.RestProperty;

export const getObjectPatternProperties = (node: t.ObjectPattern) => {
  return node.properties.map(getObjectPatternProp);
};
export const getObjectPatternProp = (
  prop: ObjectPatternProperty
): IKeyValueDescriptor => {
  switch (prop.type) {
    case 'ObjectProperty':
      if (t.isIdentifier(prop.key) && t.isIdentifier(prop.value)) {
        return { key: prop.key.name, value: prop.value.name };
      }
      return { key: prop.key.type, value: prop.value.type };
    case 'RestProperty':
      return t.isIdentifier(prop.argument)
        ? { key: `...${prop.argument.name}`, value: `...${prop.argument.name}` }
        : { key: prop.argument.type, value: prop.argument.type };
    default:
      return assertNever(prop);
  }
};

export function isNamedIdentifier(node: t.Node): node is INamedIdentifier {
  return t.isIdentifier(node) && node.name !== undefined;
}

export function assertNever(x: never): never {
  throw new Error('Unexpected object: ' + x);
}

export const getVarIdNode = (varPath: NodePath<t.VariableDeclarator>) => {
  return varPath.get('id') as NodePath<VarIDNode>;
};
