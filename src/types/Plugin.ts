import { Visitor } from 'babel-traverse';
import ParseEngine from 'src/parser/ParseEngine';

/**
 * The returned object when a plugin module has been evaluated,
 * so the plugin can parse using the visitor api, etc.
 * @interface Command
 * @namespace Plugin
 */
export interface ICommand {
  visitor: Visitor;
  pre?: (state: any) => void;
  post?: (state: any) => void;
}

/**
 * The signature of the plugin module which is evaluated at run time
 * @type Module
 * @namespace Plugin
 */
export type Module = (engine: ParseEngine, db: Lowdb) => void | ICommand;

/**
 * Plugins are queued up for evaluation by a simple interface
 * @interface IRecord
 * @namespace Plugin
 */
export interface IRecord {
  id: string;
  eval: Module;
}
