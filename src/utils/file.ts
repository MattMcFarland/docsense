import * as FS from 'fs';
import * as Glob from 'glob';
import * as MkDirP from 'mkdirp';
import * as Path from 'path';
import { promisify } from 'util';

import { log } from '../utils/logger';

const readFile = promisify(FS.readFile);

/**
 * Processes a glob pattern to an array of files
 * @param {string} pattern pattern to resolve
 * @returns {Promise<string>} all matches found from the pattern
 * @see processAllGlobPatterns
 */
export const processGlobPattern = (pattern: string): Promise<string[]> =>
  new Promise((resolve, reject) =>
    Glob(pattern, (err, matches) => (err ? reject(err) : resolve(matches)))
  );

/**
 * Processes an array of glob patterns to an array of files
 * @param {string[]} patterns patterns to resolve
 * @returns {Promise<string[]>} all matches found from the pattern
 * @uses processGlobPattern
 */
export const processAllGlobPatterns = (
  patterns: string[]
): Promise<string[][]> => Promise.all(patterns.map(processGlobPattern));

/**
 * Converts resolves the full path of the filepath relative to the current working directory.
 * @param {string} relativePath filepath to resolve
 * @returns {string} fullpath
 */
export const resolvePathFromCWD = (relativePath: string): string =>
  Path.posix.resolve(process.cwd(), relativePath);

/**
 * Resolves the full path all file patterns relative to the current working directory.
 * @param {string[]} relativePaths array of relative filepaths to resolve
 * @returns {string[]} fullpaths
 * @uses resolvePathFromCWD
 */
export const resolveAllFilePathsFromCWD = (relativePaths: string[]): string[] =>
  relativePaths.map(resolvePathFromCWD);

/**
 * Opens file, reads it, then creates an entry where the
 * filepath is key, and the raw data is the value.
 * @param {string} filepath path to be read by fs.readFile
 * @returns {Promise<entry>} [filepath, ast]
 * @uses openFileForReading
 * @uses contextAsEntry
 */
export const safelyReadFile = (filepath: string): Promise<string> =>
  resolveFile(filepath).then(openFileForReading);

/**
 * Only attempts to read real files, discarding directories, etc.
 * @param {string} filepath path to be read by fs.readFile
 * @returns {Promise<string>} The resolved file path
 * @see readFiles
 * @see parseFiles
 */
export const resolveFile = (filepath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    FS.stat(filepath, (err, stats) => {
      if (err) {
        return reject(err);
      }
      if (stats.isFile()) {
        log.info('read', filepath);
        return resolve(filepath);
      }
      log.warn('skip', filepath);
    });
  });
};

/**
 * performs fs.readfile at utf-8 encoding on the given filepath
 * @param {string} filepath - fs.readfile this
 * @returns {string} utf-8 content
 */
export const openFileForReading = (filepath: string): Promise<string> =>
  readFile(filepath, 'utf-8');

/**
 * Read the contents of all files in the given array
 * @param {string[]} filesArray - array of full paths to files
 * @returns {Promise<entry[]>} - A promise when all files have been read
 * @uses safelyReadFile
 */
export const readFiles = (filesArray: string[]): Promise<string[]> =>
  Promise.all(filesArray.map(safelyReadFile));

/**
 * Given an array of directory items (typically from fs.readdir), reduce it
 * down to just js files
 * @param {string[]} directory
 */
export const reduceDirectoryToJSFiles = (directory: string[]) =>
  directory.reduce((validFiles: string[], name: string) => {
    if (name.endsWith('.js')) {
      validFiles.push(name);
    }
    return validFiles;
  }, []);

/**
 * scan a directory using fs.readdir
 * @param {string} directoryPath
 */
export const scanDirectory = (directoryPath: string) => (): Promise<string[]> =>
  new Promise((resolve, reject) => {
    FS.readdir(directoryPath, (err, directory) => {
      if (err) {
        return reject(err);
      }
      return resolve(directory);
    });
  });

/**
 * Given the current promise chain context, resolve the paths from the relativePath
 * arguments
 * @param {arguments} relativePath
 */
export const resolveContextRelativePaths = (...relativePath: string[]) => (
  filenames: string[]
): string[] =>
  filenames.map((filename: string): string =>
    Path.posix.join(...relativePath, filename)
  );

/**
 * Evals the given function over each of the files within the given directoryPath
 * @param directoryPath path to iterate over
 * @param fn function called on each file within the directoryPath
 */
export const withAllFiles = (
  directoryPath: string,
  fn: (data: string, filename: string, index: number) => void
) => {
  const files = FS.readdirSync(directoryPath);
  files.forEach((filename, index) => {
    const data = FS.readFileSync(Path.resolve(directoryPath, filename), 'utf8');
    fn(data, filename, index);
  });
};

/**
 * Creates file from the given path, even if the path does not exist
 * Similar to running `mkdir -p [path] ; touch [path]
 * @param target target path and file
 * @param data written to the new file
 */
export const createFile = (target: string, data: string | Buffer) =>
  new Promise((resolve, reject) => {
    const dir = Path.dirname(target);

    MkDirP(dir, mkDirError => {
      if (mkDirError) return reject(mkDirError);
      FS.writeFile(target, data, writeError => {
        if (writeError) return reject(writeError);
        if (!writeError) return resolve(true);
      });
    });
  });
