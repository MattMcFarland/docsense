import { NodePath, PathOrNode } from 'babel-traverse';
import { Identifier, Node } from 'babel-types';

function isPath(prop: NodePath<Node> | Node): prop is NodePath {
  return prop instanceof NodePath;
}
function isNode(prop: NodePath<Node> | Node): prop is Node {
  return (prop as Node).start !== undefined;
}
export const createHelper = <T extends Node, R>(
  // tslint:disable-next-line:no-shadowed-variable
  resolver: (T: NodePath<T> | T) => R
) => (from: NodePath<T> | T) => {
  if (isPath(from)) return resolver(from.node);
  if (isNode(from)) return resolver(from);
};
