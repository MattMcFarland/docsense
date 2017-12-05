import { testFactory } from './utils';

const objMemberPlugin = require('../object-member');
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
    const superHero = {
      /** @property {string} name - super hero name */
      name: 'Batman',
      /** @property {string} power - super hero power */
      power: 'Super Rich',
      attack() {},
      level: 100,
    }`,
    'const foo = { bar: { name: "baz" }}',
  ],
};

describe('Core: ObjectMember', () =>
  testFactory({
    plugin: objMemberPlugin,
    suites,
  }));
