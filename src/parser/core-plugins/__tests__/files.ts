import filePlugin from '../file';
import loadPlugin from './utils/loadPlugin';

describe('Core Plugin: files', () => {
  test('matches snapshot', async () => {
    const runTest = loadPlugin({}, '__TEST__');
    const state = await runTest(filePlugin, 'foo()');
    const actual = state.file_collection;
    expect(actual).toMatchSnapshot();
  });
});
