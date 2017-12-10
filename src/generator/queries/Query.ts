import getConfig from '../../config';
import { DocSenseConfig } from '../../config/default-config';
import { connect as dbConnect } from '../../db';

class Query<A> {
  private db: Lowdb;
  private resolver: (db: Lowdb) => Promise<A>;

  constructor(resolver: (db: Lowdb) => Promise<A>) {
    this.resolver = resolver;
  }

  public exec(): Promise<A> {
    return this.connect().then(this.resolver);
  }

  private connect(): Promise<Lowdb> {
    return new Promise((resolve, reject) => {
      if (this.db) return resolve(this.db);
      return dbConnect().then(db => {
        this.db = db;
        return resolve(db);
      });
    });
  }
}

export default Query;
