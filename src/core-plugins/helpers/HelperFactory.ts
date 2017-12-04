import { NodePath, PathOrNode } from 'babel-traverse';
import { Identifier, Node } from 'babel-types';

function isPath(prop: NodePath<Node> | Node): prop is NodePath {
  return prop instanceof NodePath;
}
function isNode(prop: NodePath<Node> | Node): prop is Node {
  return prop && prop.constructor.name === 'Node';
}
/**
 * Creates a helper function that will accept Node, NodePath, or null.
 * So you can just write one function for handling Node or NodePath, since NodePaths always have a Node and are used frequently.
 * @param resolver executed on Node or NodePath<Node>, or return undefined if the param is null.
 * @returns a new helper function that executes the passed in resolver.
 */
export const createHelper = <T extends Node, R>(
  // tslint:disable-next-line:no-shadowed-variable
  resolver: (T: T) => R
) => (from: NodePath<T> | T) => {
  if (isPath(from)) return resolver(from.node);
  if (isNode(from)) return resolver(from);
  throw new TypeError(`${from} is not Node, NodePath<Node>`);
};
