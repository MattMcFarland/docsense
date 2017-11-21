import EventEmitter from 'events'
declare function DocSensePlugin(
  engine: EventEmitter,
  store: Map<K, V>
): Map<K, V> | Promise<Map<K, V>>
