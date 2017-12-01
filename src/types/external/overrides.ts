import { Node } from 'babel-types';
import { Annotation } from 'doctrine';

declare module 'babel-types' {
  // tslint:disable-next-line:no-shadowed-variable interface-name
  interface Node {
    __doc_tags__: Annotation[];
  }
}
