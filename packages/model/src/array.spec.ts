/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { fromIndicesArray, toIndicesArray, compressIndicesArray } from './array';

describe('fromIndicesArray', () => {
  test('base', () => {
    expect(fromIndicesArray('', [])).toEqual([]);
    expect(fromIndicesArray([], [])).toEqual([]);
  });

  test('single', () => {
    expect(fromIndicesArray('0', ['a'])).toEqual(['a']);
    expect(fromIndicesArray([0], ['a'])).toEqual(['a']);
  });

  test('slice', () => {
    expect(fromIndicesArray('0+2', ['a', 'b', 'c', 'd'])).toEqual(['a', 'b', 'c']);
    expect(fromIndicesArray([0, 1, 2], ['a', 'b', 'c', 'd'])).toEqual(['a', 'b', 'c']);
  });
  test('slice2', () => {
    expect(fromIndicesArray('0+2,1', ['a', 'b', 'c', 'd'])).toEqual(['a', 'b', 'c', 'b']);
    expect(fromIndicesArray([0, 1, 2, 1], ['a', 'b', 'c', 'd'])).toEqual(['a', 'b', 'c', 'b']);
  });
});

describe('toIndicesArray', () => {
  test('base', () => {
    expect(toIndicesArray([], () => 0)).toEqual([]);
  });

  test('single', () => {
    expect(toIndicesArray(['a'], () => 0)).toEqual([0]);
  });

  test('slice', () => {
    expect(toIndicesArray(['a', 'b'], (v) => 'abcdef'.indexOf(v))).toEqual([0, 1]);
  });
});

describe('compressIndicesArray', () => {
  test('base', () => {
    expect(compressIndicesArray([])).toEqual('');
  });

  test('single', () => {
    expect(compressIndicesArray([0])).toEqual('0');
  });

  test('slice', () => {
    expect(compressIndicesArray([0, 1, 2])).toEqual('0+2');
  });

  test('slice2', () => {
    expect(compressIndicesArray([0, 1, 2, 1])).toEqual('0+2,1');
  });

  test('slice2', () => {
    expect(compressIndicesArray([0, 1, 2, 1])).toEqual('0+2,1');
  });
  test('slice3', () => {
    expect(compressIndicesArray([1, 2, 3, 5, 6, 7])).toEqual('1+2,5+2');
  });
});
