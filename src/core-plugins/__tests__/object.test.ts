import { testFactory } from './utils';

const objectPlugin = require('../object');
const suites = {
  '>': [
    'const foo = {}',
    `const obj = {
      foo: bar,
      baz: bez,
      fn() { },
      thing: () => {},
      num: 100,
      numstr: "onehundred",
      dfn: function () {}
    }`,
    `
    /**
     * Super hero Record.
     * @property {string} name - super hero name
     * @property {string} power - the hero ability
     * @property {method} attack - attack
     * @property {number} level - hero level
     */
    const superHero = {
      name: 'Batman',
      power: 'Super Rich',
      attack() {},
      level: 100,
    }`,
    'const foo = { bar: { name: "baz" }}',
  ],
};

describe('Core: object', () =>
  testFactory({
    plugin: objectPlugin,
    suites,
  }));
