import { NodePath, PathOrNode } from 'babel-traverse';
import { Identifier, Node } from 'babel-types';

function isPath(prop: PathOrNode): prop is NodePath {
  return prop instanceof NodePath;
}
function isNode(prop: PathOrNode): prop is Node {
  return (prop as Node).start !== undefined;
}
export const createHelper = <T extends Node, R>(
  // tslint:disable-next-line:no-shadowed-variable
  resolver: <T>(T: PathOrNode) => R
) => ({
  get: (prop: PathOrNode) => {
    if (isPath(prop)) return resolver(prop.node);
    if (isNode(prop)) return resolver(prop);
  },
  fromPath: (path: NodePath<T>) => resolver(path.node),
  fromNode: (node: T) => resolver(node),
});
