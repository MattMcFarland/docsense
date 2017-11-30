import { resolve as resolvePath } from 'path';
import {
  reduceDirectoryToJSFiles,
  scanDirectory,
  resolveContextRelativePaths,
} from './file';
import ParseEngine from '../parser/ParseEngine';
import * as Plugin from '../types/Plugin';
import { IConfig } from 'src/config';

type ConfigAndPlugins = Promise<{
  config: IConfig;
  plugins: Plugin.Record[];
}>;

export const setupCorePlugins = (config: IConfig): ConfigAndPlugins =>
  scanCorePluginDirectory()
    .then(reduceDirectoryToJSFiles)
    .then(resolveCorePluginPaths)
    .then(setupPlugins)
    .then((plugins: Plugin.Record[]) => ({ config, plugins }));

export const resolveCorePluginPaths = resolveContextRelativePaths(
  '../core-plugins'
);
export const scanCorePluginDirectory = scanDirectory(
  resolvePath(__dirname, '../core-plugins')
);

export const resolvePluginModule = (id: string): Plugin.Module =>
  module.require(id).default || module.require(id);

export const setupPlugin = (id: string): Plugin.Record => ({
  id,
  eval: resolvePluginModule(id),
});

export const setupPlugins = (filepaths: string[]): Plugin.Record[] =>
  filepaths.map(filepath => setupPlugin(filepath));

export const registerPlugin = (
  parser: ParseEngine,
  plugin: Plugin.Record,
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
