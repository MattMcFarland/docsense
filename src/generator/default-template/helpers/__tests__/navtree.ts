import * as NavTree from '../navtree';

// NavTree.daam(path)
// NavTree.hasKeys(obj)
// NavTree.keysReduce(obj, cb)
// NavTree.makeDAAMItem(coordinates)
// NavTree.makeFolderItem(key, coordinates, path)
// NavTree.makeListItem(node, key, coordinates, path)
// NavTree.makeModuleItem()

describe('navtree', () => {
  describe('collectionToString', () => {
    NavTree.collectionToString(obj);
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
  describe('keysReduce', () => {});
  describe('makeFolderItem', () => {});
  describe('makeListItem', () => {});
  describe('makeModuleItem', () => {});
});
