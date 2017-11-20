// @flow

import { resolve as resolvePath } from 'path'
import { promisify } from 'util'
import fs from 'fs'
import glob from 'glob'

const readFile = promisify(fs.readFile)

/**
 * Processes a glob pattern to an array of files
 * @param {string} pattern pattern to resolve
 * @returns {Promise<string>} all matches found from the pattern
 * @throws {Error} If nothing is found
 * @see processAllGlobPatterns
 */
export const processGlobPattern = (pattern: string): Promise<string> =>
  new Promise((resolve, reject) => {
    glob(pattern, (err, matches) => {
      if (err) return reject(err)
      return resolve(matches)
    })
  })

/**
 * Processes an array of glob patterns to an array of files
 * @param {string} pattern pattern to resolve
 * @returns {Promise<string[]>} all matches found from the pattern
 * @throws {Error} If nothing is found
 * @uses processGlobPattern
 */
export const processAllGlobPatterns = (patterns: string[]): Promise<string[]> =>
  Promise.all(patterns.map(processGlobPattern))

/**
 * Converts resolves the full path of the filepath relative to the current working directory.
 * @param {string} relativePath filepath to resolve
 * @returns {string} fullpath
 * @uses resolvePath
 */
export const resolvePathFromCWD = (relativePath: string): string =>
  resolvePath(process.cwd(), relativePath)

/**
 * Resolves the full path all file patterns relative to the current working directory.
 * @param {string[]} relativePaths array of relative filepaths to resolve
 * @returns {string[]} fullpaths
 * @uses resolvePathFromCWD
 */
export const resolveAllFilePathsFromCWD = (relativePaths: string[]): string[] =>
  relativePaths.map(resolvePathFromCWD)

/**
 * Opens file, reads it, then creates an entry where the
 * filepath is key, and the raw data is the value.
 * @param {string} filepath path to be read by fs.readFile
 * @returns {Promise<entry>} [filepath, ast]
 * @uses openFileForReading
 * @uses contextAsEntry
 */
export const safelyReadFile = (filepath: string): Promise<entry> =>
  resolveFile(filepath).then(openFileForReading)

/**
 * Only attempts to read real files, discarding directories, etc.
 * @param {string} filepath path to be read by fs.readFile
 * @returns {Promise<string>} The resolved file path
 * @see readFiles
 * @see parseFiles
 */
export const resolveFile = (filepath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.stat(filepath, (err, stats) => {
      if (err) return reject(err)
      if (stats.isFile()) {
        console.log('resolve', filepath)
        return resolve(filepath)
      }
      console.warn('skip', filepath)
      return
    })
  })
}

/**
 * performs fs.readfile at utf-8 encoding on the given filepath
 * @param {string} filepath - fs.readfile this
 * @returns {string} utf-8 content
 */
export const openFileForReading = (filepath: string) =>
  readFile(filepath, 'utf-8')

/**
 * Read the contents of all files in the given array
 * @param {string[]} filesArray - array of full paths to files
 * @returns {Promise<entry[]>} - A promise when all files have been read
 * @uses safelyReadFile
 */
export const readFiles = (filesArray: string[]): Promise<entry[]> =>
  Promise.all(filesArray.map(safelyReadFile))
