import { resolve as resolvePath } from 'path';
import { IConfig } from '../config';
import ParseEngine from '../parser/ParseEngine';
import { IPluginModule, IPluginRecord } from '../types/Plugin';
import {
  reduceDirectoryToJSFiles,
  resolveContextRelativePaths,
  scanDirectory,
} from './file';
import * as assert from 'assert';

type ConfigAndPlugins = Promise<{
  config: IConfig;
  plugins: IPluginRecord[];
}>;

export const setupCorePlugins = (config: IConfig): ConfigAndPlugins =>
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
  const plugin: IPluginModule =
    module.require(id).default || module.require(id);
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
  const pluginCommand = plugin.eval(parser, db);
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
