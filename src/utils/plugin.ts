import { resolve as resolvePath } from 'path';
import { IConfig } from '../config';
import ParseEngine from '../parser/ParseEngine';
import * as Plugin from '../types/Plugin';
import {
  reduceDirectoryToJSFiles,
  resolveContextRelativePaths,
  scanDirectory,
} from './file';

type ConfigAndPlugins = Promise<{
  config: IConfig;
  plugins: Plugin.IRecord[];
}>;

export const setupCorePlugins = (config: IConfig): ConfigAndPlugins =>
  scanCorePluginDirectory()
    .then(reduceDirectoryToJSFiles)
    .then(resolveCorePluginPaths)
    .then(setupPlugins)
    .then((plugins: Plugin.IRecord[]) => ({ config, plugins }));

export const resolveCorePluginPaths = resolveContextRelativePaths(
  '../core-plugins'
);
export const scanCorePluginDirectory = scanDirectory(
  resolvePath(__dirname, '../core-plugins')
);

export const resolvePluginModule = (id: string): Plugin.Module =>
  module.require(id).default || module.require(id);

export const setupPlugin = (id: string): Plugin.IRecord => ({
  eval: resolvePluginModule(id),
  id,
});

export const setupPlugins = (filepaths: string[]): Plugin.IRecord[] =>
  filepaths.map(filepath => setupPlugin(filepath));

export const registerPlugin = (
  parser: ParseEngine,
  plugin: Plugin.IRecord,
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
