import { Visitor } from 'babel-traverse';
import ParseEngine from '../parser/ParseEngine';
import Store from '../store';

/**
 * The signature of the plugin module which is evaluated at run time
 */
export interface IPluginModuleFn {
  // tslint:disable-next-line:callable-types
  (engine: ParseEngine, db: Lowdb | Store): void | IPluginCommand;
  key: string;
}

export interface IPluginMetaData {
  collectionName: string;
  key: string;
  pluginKey: string;
}
export interface IObjectWithDefault {
  default: IPluginModuleFn;
}

export type IPluginModule = IPluginModuleFn &
  IPluginMetaData &
  IObjectWithDefault;

/**
 * The returned object when a plugin module has been evaluated,
 * so the plugin can parse using the visitor api, etc.
 */
export interface IPluginCommand {
  visitor: Visitor;
  pre?: (state: any) => void;
  post?: (state: any) => void;
}

/**
 * Plugins are queued up for evaluation by a simple interface
 */
export interface IPluginRecord {
  id: string;
  eval: IPluginModuleFn;
}

export type IPluginModuleAndRecord = IPluginRecord & IPluginModule;

export default IPluginModule;
