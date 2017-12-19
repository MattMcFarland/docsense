import dirPlugin from '../directory';
import loadPlugin from './utils/loadPlugin';

describe('core-plugin: directory', () => {
  test('matches snapshot', async () => {
    const runTest = loadPlugin({}, '__TEST__');
    const state = await runTest(dirPlugin, 'foo()');
    expect(state).toMatchSnapshot();
  });
});
