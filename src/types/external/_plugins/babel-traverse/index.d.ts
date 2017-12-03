import { Scope, NodePath } from 'babel-traverse';
import { Node } from 'babel-types';

declare module 'babel-traverse' {
  export interface Scope {
    globals;
  }

  export type PathOrNode = NodePath | Node;
}
