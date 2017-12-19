import { NodePath } from 'babel-traverse';
import { Node } from 'babel-types';
import { Lowdb } from './db';

export default class Store {
  public db: Lowdb;
  public entryId: string;
  public collectionName: string;
  public id: string;
  constructor(db: Lowdb, id: string) {
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
    return <B>(data: B) =>
      db
        .get(collectionName)
        .push(data)
        .write();
  }
  public insert(id_val: string, file_id: string) {
    const db = this.db;
    const collectionName = this.collectionName;
    const entryId = this.entryId;
    return <B>(data: B) =>
      db
        .get(collectionName)
        .find({ [entryId]: id_val, file_id })
        .assign(data)
        .write();
  }
}
