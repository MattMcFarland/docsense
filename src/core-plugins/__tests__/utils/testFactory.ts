import * as assert from 'assert';
import testPlugin from './testPlugin';
import { IPluginModuleAndRecord } from '../../../types/Plugin';

export default ({ plugin, suites }: ITestModule): void => {
  assert(plugin, 'testFactory missing plugin argument');
  assert(suites, 'testFactory missing suite argument');
  const collection = plugin.collectionName;
  entries(suites).forEach(([suite, fns]) => {
    describe(suite, () => {
      entries(fns).forEach(entryOrSnapshotTest => {
        if (entryOrSnapshotTest.length === 2) {
          const [fn, expected] = entryOrSnapshotTest;
          test(fn, async () => {
            const runTest = testPlugin({}, '__TEST__');
            const state = await runTest(plugin, fn);
            const actual = state[collection];
            expect(actual).toEqual(expected);
          });
        } else {
          test(entryOrSnapshotTest, async () => {
            const runTest = testPlugin({}, '__TEST__');
            const state = await runTest(plugin, entryOrSnapshotTest);
            const actual = state[collection];
            expect(actual).toMatchSnapshot();
          });
        }
      });
    });
  });
};

function entries(objOrArray: any): any[] {
  if (Array.isArray(objOrArray)) {
    return objOrArray;
  }
  return Object.entries(objOrArray);
}

export interface ITestModule {
  plugin: IPluginModuleAndRecord;
  suites: any;
}
