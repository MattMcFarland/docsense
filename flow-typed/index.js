// @flow

/** @typedef {string} K the key of a value in a key-value pair*/
type K = string
/** @typedef {any} V the value in a key-value pair*/
type V = any
/** @typedef {[K, V]} entry A key value pair specified in a tuple array [0,1] = [K,V] */
type entry = [K, V]
/** @typedef POJO Plain old Javascript Object, AKA Object Literal */
type POJO = { [K]: V }
/** @typedef AST Abstract Syntax Tree */
type AST = { ...AST }
/** @typedef Passthrough returns the original context */

type Passthrough = (any: any) => any
type Fn = (any: any) => any
