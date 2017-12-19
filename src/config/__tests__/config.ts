import getConfig from '../';
import defaultConfig from '../default-config';

const cc = jest.genMockFromModule('cosmiconfig');

jest.mock('cosmiconfig', () =>
  jest.fn(() => ({
    load: jest.fn(() => Promise.resolve({})),
  }))
);

describe('config', () => {
  test('provides the default configuration, if none presented', async () => {
    delete process.env.DOCSENSE_CONFIG;
    const config = await getConfig();
    expect(config).toEqual(defaultConfig);
  });
  test('provides custom configuration when environment variable DOCSENSE_CONFIG is set', async () => {
    process.env.DOCSENSE_CONFIG = `{ "foo": "bar" }`;
    const config = await getConfig();
    expect(config).toEqual({ foo: 'bar' });
  });
});
