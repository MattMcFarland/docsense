import { testFactory } from './utils';

const classPlugin = require('../class');
const suites = {
  '>': [`class Foo {}`, `class Bar {}`, `class Baz {}`],
};

describe('Core: class', () =>
  testFactory({
    plugin: classPlugin,
    suites,
  }));
