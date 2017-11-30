declare module NodeJS {
  interface Global {
    log: NPMLOG
  }
}

declare type Lowdb = Lowdb.Lowdb

declare module "*.json" {
  const value: any;
  export default value;
}
