import dirPlugin from '../directory';
import loadPlugin from './utils/loadPlugin';

describe('Core Plugin: files', () => {
  test('matches snapshot', async () => {
    const runTest = loadPlugin({}, '__TEST__');
    const state = await runTest(dirPlugin, 'foo()');
    const actual = state.directory_collection;
    expect(actual).toMatchSnapshot();
  });
});
