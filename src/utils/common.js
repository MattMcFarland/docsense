// @flow

/**
 * Send a status message while in a promise chain
 * @param {string} msg
 * @returns {Passthrough} - context of the promise chain is unchanged.
 */
export const status = (msg: string) => (context: Context): any => {
  log.info('status', msg)
  return context
}

export const logMap = (prefix: string) => (items: string[]): string[] => {
  items.forEach(item => log.info(prefix, item))
  return items
}

/**
 * Changes context in promise chain
 * @param {*} newContext next thing in promise chain will focus on this
 */
export const setContext = (newContext: Context) => (): Promise<any> =>
  Promise.resolve(newContext)

/**
 * Wipes the context to undefined, useful for controlling flow
 * @returns {void}
 */
export const voidContext = setContext(undefined)

/**
 * Writes the context of a promise chain to the given key as an entry ( [key, context] )
 * @param {string} key
 * @returns {entry}
 */
export const contextAsEntry = <K, V>(key: K) => (context: V): Entry<K, V> => [
  key,
  context,
]

/**
 * Converts entries to a POJO
 * @param {entry[]} entries
 * @returns {POJO} converted entries
 */
export const convertEntriesToObject = <K, V>(entries: Entry<K, V>[]) =>
  entries.reduce(
    (obj, [key, value]) => Object.defineProperty(obj, key, { value }),
    {}
  )

/**
 * Extracts values from entries
 * @param {entry[]} entries
 * @returns {V[]} values
 */
export const extractValuesFromEntries = <K, V>(entries: Entry<K, V>[]): V[] =>
  entries.map(([, value]: Entry<K, V>) => (value: V))

/**
 * Logs error, exits 1
 * @param {Error} err error object
 * @returns {void}
 */
export const fatalError = (err: Error): void => {
  log.error('ERR', err)
  process.exit(1)
}
/**
 * Logs the current context to the console
 * @param {*} context log this
 * @returns {*} context
 */
export const logContext = (context: Context): any => {
  log.info('ctx', context)
  return context
}

/**
 * Removes duplicates from the given array
 * @param {Array} arr dedupe this array
 * @returns {Array} deduped
 */
export const dedupe = (arr: Array<any>): Array<any> =>
  arr.reduce((x, y) => (x.includes(y) ? x : [...x, y]), [])

/**
 * Flattens an array that is one level deep.
 * @param {Array} arr flatten this array
 * @returns {Array} deduped
 */
export const flatten = (arr: Array<any>): Array<any> => [].concat(...arr)
