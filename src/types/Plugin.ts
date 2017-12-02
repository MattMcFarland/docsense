import { Visitor } from 'babel-traverse';
import ParseEngine from '../parser/ParseEngine';

/**
 * The signature of the plugin module which is evaluated at run time
 */
export type PluginModuleFn = (
  engine: ParseEngine,
  db: Lowdb
) => void | IPluginCommand;

export interface IPluginMetaData {
  collectionName: string;
  pluginKey: string;
}
export interface IObjectWithDefault {
  default: PluginModuleFn;
}

export type IPluginModule = PluginModuleFn &
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
  eval: PluginModuleFn;
}

export type IPluginModuleAndRecord = IPluginRecord & IPluginModule;

export default IPluginModule;
