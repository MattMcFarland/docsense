//@flow

import { readdir } from 'fs'
import { join as joinPath, resolve as resolvePath } from 'path'
import {
  reduceDirectoryToJSFiles,
  scanDirectory,
  resolveContextRelativePaths,
} from './file'

opaque type ConfigAndPlugins = Promise<{
  config: DocSenseConfig,
  plugins: PluginAPI[],
}>

export const setupCorePlugins = (config: DocSenseConfig): ConfigAndPlugins =>
  scanCorePluginDirectory()
    .then(reduceDirectoryToJSFiles)
    .then(resolveCorePluginPaths)
    .then(setupPlugins)
    .then((plugins: PluginAPI[]) => ({ config, plugins }))

export const resolveCorePluginPaths = resolveContextRelativePaths(
  '../core-plugins'
)
export const scanCorePluginDirectory = scanDirectory(
  resolvePath(__dirname, '../core-plugins')
)

export const resolvePluginModule = (id: string): DocSensePlugin =>
  module.require(id).default || module.require(id)

export const setupPlugin = (id: string): PluginAPI => ({
  id,
  exec: resolvePluginModule(id),
})

export const setupPlugins = (filepaths: string[]): PluginAPI[] =>
  filepaths.map(filepath => setupPlugin(filepath))
