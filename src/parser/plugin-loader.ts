import * as assert from 'assert';
import { Visitor } from 'babel-traverse';
import { resolve as resolvePath } from 'path';

import { DocSenseConfig } from './../config';
import { Lowdb } from './../storage/db';
import Store from './../storage/store';
import { reduceDirectoryToJSFiles, scanDirectory } from './../utils/file';
import ParseEngine from './ParseEngine';

type ConfigAndPlugins = Promise<{
  config: DocSenseConfig;
  plugins: IPluginRecord[];
}>;

export const setupCorePlugins = (config: DocSenseConfig): ConfigAndPlugins =>
  scanCorePluginDirectory()
    .then(reduceDirectoryToJSFiles)
    .then(resolveCorePluginPaths)
    .then(setupPlugins)
    .then((plugins: IPluginRecord[]) => ({ config, plugins }));

export const resolveCorePluginPaths = (pluginPaths: string[]) => {
  return pluginPaths.map(pluginPath =>
    resolvePath(__dirname, './core-plugins', pluginPath)
  );
};
export const scanCorePluginDirectory = scanDirectory(
  resolvePath(__dirname, './core-plugins')
);

export const resolvePluginModule = (id: string): IPluginModule => {
  const plugin: IPluginModule = module.require(id);
  // assert(plugin.pluginKey, `Plugin "${id}" must export a pluginKey`);
  return plugin;
};

export const setupPlugin = (id: string): IPluginRecord => ({
  eval: resolvePluginModule(id),
  id,
});

export const setupPlugins = (filepaths: string[]): IPluginRecord[] =>
  filepaths.map(filepath => setupPlugin(filepath));

export const registerPlugin = (
  parser: ParseEngine,
  plugin: IPluginRecord,
  db: Lowdb
) => {
  const pluginExec = plugin.eval as IPluginModule;
  const store = pluginExec.key ? new Store(db, pluginExec.key) : undefined;
  const runPlugin = pluginExec.default ? pluginExec.default : pluginExec;
  const pluginCommand = store
    ? runPlugin(parser, store)
    : runPlugin(parser, db);

  if (pluginCommand) {
    if (typeof pluginCommand.pre === 'function') {
      parser.on('addFile:before', pluginCommand.pre);
    }
    if (pluginCommand.visitor) {
      parser.on('addFile', ({ path, sourceCode }) => {
        path.traverse(pluginCommand.visitor, {
          sourceCode,
          state: db.getState(),
        });
      });
    }
    if (typeof pluginCommand.post === 'function') {
      parser.on('addFile:after', pluginCommand.post);
    }
  }
};

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
