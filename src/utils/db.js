// @flow

// /**
//  * Returns the value from database
//  * @param {K} key
//  * @returns {V} value
//  */
// export const fromDB = (key: K): V =>
//   cache
//     .get("db")
//     .get(key)
//     .value();

// /**
//  * Writes key value to database
//  * @param {K} key write this key
//  * @param {V} value with this value
//  * @returns {void}
//  */
// export const toDB = (key: K, value: V): Promise<void> =>
//   Promise.resolve(
//     cache
//       .get("db")
//       .get(key)
//       .assign(value)
//       .write()
//   );
