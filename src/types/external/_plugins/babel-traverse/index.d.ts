import { Scope } from 'babel-traverse';

declare module 'babel-traverse' {
  export interface Scope {
    globals;
  }
}
