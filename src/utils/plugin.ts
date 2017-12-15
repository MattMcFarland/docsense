import * as assert from 'assert';
import { resolve as resolvePath } from 'path';

import { IPluginModule, IPluginRecord } from '../_types/Plugin';
import { DocSenseConfig } from '../config';
import ParseEngine from '../parser/ParseEngine';
import Store from '../store';
import {
  reduceDirectoryToJSFiles,
  resolveContextRelativePaths,
  scanDirectory,
} from './file';

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

export const resolveCorePluginPaths = resolveContextRelativePaths(
  '../core-plugins'
);
export const scanCorePluginDirectory = scanDirectory(
  resolvePath(__dirname, '../core-plugins')
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
