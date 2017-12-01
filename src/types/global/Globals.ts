// tslint:disable-next-line:no-namespace
declare namespace NodeJS {
  // tslint:disable-next-line:interface-name
  interface Global {
    log: NPMLOG;
  }
}

declare type Lowdb = Lowdb.Lowdb;

declare module '*.json' {
  const value: any;
  export default value;
}
