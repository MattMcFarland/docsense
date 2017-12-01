// Type definitions for babel-types
// Project: babel-types
// Definitions by: Matt McFarland

import { Node, Identifier } from 'babel-types';
import { Annotation } from 'doctrine';
declare module 'babel-types' {
  export interface Node {
    id?: Identifier;
    __doc_tags__?: Annotation[];
  }
}
