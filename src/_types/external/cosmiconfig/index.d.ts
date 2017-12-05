// Type definitions for cosmiconfig
// Definitions by: Matt McFarland

declare module 'cosmiconfig' {
  export = Cosmiconfig;
}

/**
 * @module cosmiconfig Find and load configuration from a package.json property, rc file, or CommonJS module
 * @param moduleName This is used to create the default filenames that cosmiconfig will look for.
 * @param {Cosmiconfig.Options} options optional options
 */
declare function Cosmiconfig(
  moduleName: string,
  options?: Cosmiconfig.Options
): Cosmiconfig.Explorer;

declare namespace Cosmiconfig {
  export enum Format {
    'json',
    'yaml',
    'js',
  }
  export interface Options {
    packageProp?: string | false;
    rc?: string | false;
    js?: string | false;
    rcStrictJson?: boolean;
    rcExtensions?: boolean;
    stopDir?: string;
    cache?: string;
    sync?: string;
    transform?: string;
    configPath?: string;
    format?: Cosmiconfig.Format;
  }
  export interface FileRecord {
    /**
     * The loaded and parsed configuration.
     */
    config: any;
    /**
     * The filepath where this configuration was found.
     */
    filepath: string;
  }
  export interface Explorer {
    /**
     * Find and load a configuration file. Returns a Promise that resolves with null, if nothing is found, or the configRecord object.
     * @param searchPath If you provide searchPath, cosmiconfig will start its search at searchPath and continue to search up the directory tree, as documented above.
     * @param configPath If you provide configPath (i.e. you already know where the configuration is that you want to load), cosmiconfig will try to read and parse that file. Note that the format option is applicable for this as well.
     */
    load: (
      searchPath?: string,
      configPath?: string
    ) => Promise<Cosmiconfig.FileRecord>;
  }
}
