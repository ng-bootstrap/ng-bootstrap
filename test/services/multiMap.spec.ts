import {UibMultiMap} from '../../src/core';
import {
  beforeEach,
  ddescribe,
  xdescribe,
  describe,
  expect,
  iit,
  it,
  xit
} from 'angular2/test_lib';

describe('multi map', function() {
  let multiMap;

  beforeEach(() => {
    multiMap = new UibMultiMap();
  });

  it('should add and remove objects by key', () => {
    multiMap.put('foo', 'bar');

    expect(multiMap.get('foo')).toEqual(['bar']);

    multiMap.put('foo', 'baz');

    expect(multiMap.get('foo')).toEqual(['bar', 'baz']);

    multiMap.remove('foo', 'bar');

    expect(multiMap.get('foo')).toEqual(['baz']);

    multiMap.remove('foo', 'baz');

    expect(multiMap.hasKey('foo')).toBe(false);
  });

  it('should support getting the keys', () => {
    multiMap.put('foo', 'bar');
    multiMap.put('baz', 'boo');

    expect(multiMap.keys()).toEqual(['foo', 'baz']);
  });

  it('should return all entries', () => {
    multiMap.put('foo', 'bar');
    multiMap.put('foo', 'bar2');
    multiMap.put('baz', 'boo');

    expect(multiMap.entries()).toEqual([
      {
        key: 'foo',
        value: ['bar', 'bar2']
      },
      {
        key: 'baz',
        value: ['boo']
      }
    ]);
  });

  it('should preserve semantic of an empty key', () => {
    expect(multiMap.get('key')).toBeUndefined();
  });

  it('should respect removal of non-existing elements', () => {
    expect(multiMap.remove('foo', 'bar')).toBeUndefined();
  });
});
