// @flow
import Lowdb from 'lowdb'
import EventEmitter from 'events'
declare function DocSensePlugin(engine: EventEmitter, db: Lowdb): void
declare type PluginAPI = {
  id: string,
  exec: DocSensePlugin,
}
