import { NodePath } from 'babel-traverse';
import { Node } from 'babel-types';

export default class Store {
  public db: Lowdb.Lowdb;
  public entryId: string;
  public collectionName: string;
  public id: string;
  constructor(db: Lowdb.Lowdb, id: string) {
    this.entryId = `${id}_id`;
    this.collectionName = `${id}_collection`;
    this.db = db;
    this.id = id;
    this.db.set(this.collectionName, []).write();
  }
  public createPush<T extends Node>(path: NodePath<T>) {
    const db = this.db;
    const collectionName = this.collectionName;
    const entryId = this.entryId;
    return (data: any) =>
      new Promise(resolve => {
        db
          .get(collectionName)
          .push(data)
          .write();
        return resolve(data[entryId]);
      });
  }
  public insert(id_val: string) {
    const db = this.db;
    const collectionName = this.collectionName;
    const entryId = this.entryId;
    return (data: any) =>
      new Promise(resolve => {
        db
          .get(collectionName)
          .find({ [entryId]: id_val })
          .assign(data)
          .write();
        return resolve(data);
      });
  }
}
