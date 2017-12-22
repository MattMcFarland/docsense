import * as NavTree from '../navtree';

const navtreeCollection = require('./__fixtures__/navtree-collection.json');

describe('navtree', () => {
  describe('collectionToString', () => {
    it('matches snapshot', () => {
      expect(NavTree.collectionToString(navtreeCollection)).toMatchSnapshot();
    });
  });
  describe('daam', () => {
    it('removes the last item from path', () => {
      expect(NavTree.daam('foo/bar/baz')).toBe('bar');
    });
  });
  describe('hasKeys', () => {
    it('returns true when an object has keys', () => {
      const withKeys = { foo: 'bar' };
      expect(NavTree.hasKeys(withKeys)).toBe(true);
    });
    it('returns false when an object is empty', () => {
      const noKeys = {};
      expect(NavTree.hasKeys(noKeys)).toBe(false);
    });
  });
  describe('makeFolderItem', () => {
    it('matches snapshot', () => {
      expect(
        NavTree.makeFolderItem('foo', [0, 1, 2], 'foo/bar/baz')
      ).toMatchSnapshot();
    });
  });
  describe('makeListItem', () => {
    it('matches snapshot', () => {
      expect(
        NavTree.makeListItem(
          navtreeCollection,
          'foo',
          [0, 1, 2],
          '/foo/bar/baz'
        )
      ).toMatchSnapshot();
    });
  });
  describe('makeModuleItem', () => {
    expect(
      NavTree.makeModuleItem({ path: 'foo/bar', name: 'baz' })
    ).toMatchSnapshot();
  });
});
