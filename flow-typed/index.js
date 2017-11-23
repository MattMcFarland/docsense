// @flow

/** @typedef {any} K the key of a value in a key-value pair*/
type K = any
/** @typedef {any} V the value in a key-value pair*/
type V = any
/** @typedef {[K, V]} entry A key value pair specified in a tuple array [0,1] = [K,V] */
type entry = [K, V]
/** @typedef POJO Plain old Javascript Object, AKA Object Literal */
type POJO = { [K]: V }
/** @typedef Passthrough returns the original context */

type Passthrough = (any: any) => any
type Fn = (any: any) => any
