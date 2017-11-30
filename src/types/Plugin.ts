import { Visitor } from 'babel-traverse';
import ParseEngine from 'src/parser/ParseEngine';

/**
 * The returned object when a plugin module has been evaluated,
 * so the plugin can parse using the visitor api, etc.
 * @interface Command
 * @namespace Plugin
 */
export interface Command {
  visitor: Visitor;
  pre?: (state: any) => void;
  post?: (state: any) => void;
}

/**
 * The signature of the plugin module which is evaluated at run time
 * @interface Command
 * @namespace Plugin
 */
export type Module = (engine: ParseEngine, db: Lowdb) => void | Command;

/**
 * Plugins are queued up for evaluation by a simple interface
 * @interface Command
 * @namespace Plugin
 */
export interface Record {
  id: string;
  eval: Module;
}
