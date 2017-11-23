declare class log {
  static log(logLevel: string, prefix: string, ...args: Array<any>): void;
  static info(prefix: string, ...args: Array<any>): void;
  static warn(prefix: string, ...args: Array<any>): void;
  static error(prefix: string, ...args: Array<any>): void;
}
