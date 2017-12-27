import { connect as dbConnect, Lowdb } from '../../storage/db';

/**
 * Creates a Query of the database
 */
class Query<A, B> {
  private db: Lowdb;
  private resolver: (db: Lowdb, ...args: B[]) => Promise<A>;

  /**
   * The resolver function that will be called when you run exec()
   * @param resolver {Function (db, ...args)}
   */
  constructor(resolver: (db: Lowdb, ...args: B[]) => Promise<A>) {
    this.resolver = resolver;
  }

  /**
   * Runs the query asynchronously, returning a promise.
   * @param args args passed to exec, if any.
   * @returns Promise<A>
   */
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
