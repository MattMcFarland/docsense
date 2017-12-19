import * as esModulesPlugin from '../es-modules';
import loadPlugin from './utils/loadPlugin';

describe('core-plugin: es-modules', () => {
  test('matches snapshots', async () => {
    const snapTest = createSnapTest(esModulesPlugin);

    await snapTest('export function foo () {}');
    await snapTest('export default function () {}');
    await snapTest('export { default as foo } from "bar"');
    await snapTest('const foo = function () {}; export default foo;');

    // TODO: These ExportSpecifiers should not be skipped!
    await snapTest('const ahoy = "bar"; export { ahoy };');
    await snapTest('export { bar, baz };');
    await snapTest('const name = "bar"; export { name as default};');
  });
});

function createSnapTest(plugin: any) {
  const runTest = loadPlugin({}, '__TEST__');
  return async (expression: string) => {
    const result = await runTest(plugin, expression);
    expect(result).toMatchSnapshot();
    return true;
  };
}
