//@flow

import { readdir } from 'fs'
import { join as joinPath, resolve as resolvePath } from 'path'
import { reduceDirectoryToJSFiles } from './file'

opaque type ConfigAndPlugins = Promise<{
  config: DocSenseConfig,
  plugins: PluginAPI[],
}>

export const setupCorePlugins = (config: DocSenseConfig): ConfigAndPlugins =>
  scanPluginDirectory()
    .then(reduceDirectoryToJSFiles)
    .then(resolveCorePluginPaths)
    .then(setupPlugins)
    .then((plugins: PluginAPI[]) => ({ config, plugins }))

export const resolveCorePluginPaths = (filenames: string[]): string[] =>
  filenames.map((filename: string): string =>
    joinPath('../core-plugins', filename)
  )

export const resolvePluginModule = (id: string): DocSensePlugin =>
  module.require(id).default || module.require(id)

export const setupPlugin = (id: string): PluginAPI => ({
  id,
  exec: resolvePluginModule(id),
})

export const setupPlugins = (filepaths: string[]): PluginAPI[] =>
  filepaths.map(filepath => setupPlugin(filepath))

export const scanPluginDirectory = (): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    const pluginDirPath = resolvePath(__dirname, '../core-plugins')
    readdir(pluginDirPath, (err, directory) => {
      if (err) return reject(err)
      return resolve(directory)
    })
  })
}
