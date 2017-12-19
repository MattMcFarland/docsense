import * as esModulesPlugin from '../es-modules';
import loadPlugin from './utils/loadPlugin';

describe('Core Plugin: esModules', () => {
  test('export function foo () {}', async () => {
    const runTest = loadPlugin({}, '__TEST__');
    const state = await runTest(esModulesPlugin, 'export function foo () {}');
    const actual = state.esModule_collection;

    expect(actual).toMatchSnapshot();
  });
});
