import { NodePath } from 'babel-traverse';
import * as t from 'babel-types';
import { Annotation } from 'doctrine';
import * as Path from 'path';

import { encode } from '../../utils/base64';

import {
  FunctionType,
  IKeyValueDescriptor,
  INamedIdentifier,
  Param,
  Parameter,
  VarIDNode,
} from './types';

export const getFileName = (nodePath: NodePath) => {
  const parts = Path.parse(nodePath.node.loc.filename);
  return `${parts.dir}/${parts.name}`;
};

export const getFileId = (nodePath: NodePath, root?: string) => {
  const pathFromRoot = Path.posix.relative(
    root || '',
    nodePath.node.loc.filename
  );
  const parts = Path.parse(pathFromRoot);
  return encode(`${parts.dir}/${parts.name}`);
};

export const getFunctionMeta = (nodePath: NodePath<FunctionType>) => {
  const node = nodePath.node;
  const { line, column } = node.loc.start;
  const location_id = `${line}:${column}`;
  const id = t.isIdentifier(node.id) ? node.id.name : 'anonymous';
  const function_id = id + '@' + location_id;
  const params = getFunctionParamsFromNode(nodePath.node);
  const jsdoc = getDocTagsFromPath(nodePath);
  return { function_id, params, jsdoc };
};

export function getDocTagsFromPath(nodePath: NodePath): Annotation[] {
  const tags =
    nodePath.node.__doc_tags__ ||
    nodePath.getStatementParent().node.__doc_tags__ ||
    nodePath.parent.__doc_tags__;
  return tags && tags.length ? tags : [];
}

export const getFunctionParamsFromNode = (
  node: FunctionType | t.ClassMethod
): Param[] => {
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
