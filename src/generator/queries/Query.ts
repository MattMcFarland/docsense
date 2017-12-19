import getConfig, { DocSenseConfig } from '../../config';
import { connect as dbConnect, Lowdb } from '../../storage/db';

class Query<A, B> {
  private db: Lowdb;
  private resolver: (db: Lowdb, ...args: B[]) => Promise<A>;

  constructor(resolver: (db: Lowdb, ...args: B[]) => Promise<A>) {
    this.resolver = resolver;
  }

  public exec(...args: B[]): Promise<A> {
    return this.connect().then(db => this.resolver(db, ...args));
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
