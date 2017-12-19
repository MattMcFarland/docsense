import filePlugin from '../file';
import loadPlugin from './utils/loadPlugin';

describe('core-plugin: file', () => {
  test('matches snapshot', async () => {
    const runTest = loadPlugin({}, '__TEST__');
    const state = await runTest(filePlugin, 'foo()');
    expect(state).toMatchSnapshot();
  });
});
