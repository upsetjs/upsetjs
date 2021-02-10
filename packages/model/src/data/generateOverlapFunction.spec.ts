/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */
/// <reference types="jest" />
import {
  common,
  aInB,
  bInA,
  combinedKey,
  generateIntersectionOverlapFunction,
  generateDistinctOverlapFunction,
  generateUnionOverlapFunction,
} from './generateOverlapFunction';
import { asSet } from './asSets';
import { asCombination } from './asCombinations';
import type { ISetLike } from '../model';
import generateCombinations from './generateCombinations';

describe('helpers', () => {
  const a = asSet({ name: 'A', elems: [1, 2, 3] });
  const b = asSet({ name: 'B', elems: [3, 4] });
  const ac = asCombination({ name: 'Ac', elems: [1, 2, 3] }, 'intersection', () => [a]);
  const bc = asCombination({ name: 'Bc', elems: [3, 4] }, 'intersection', () => [b]);
  const ab = asCombination({ name: 'AB', elems: [3] }, 'intersection', () => [a, b]);

  const toKey = (v: ISetLike<unknown>) => v.name.toLowerCase();

  describe('common', () => {
    test('same', () => {
      const r = common(a, a, toKey);
      expect(r.done).toBe(3);
    });
    test('same2', () => {
      const r = common(ac, ac, toKey);
      expect(r.done).toBe(3);
    });
    test('a set b set', () => {
      const r = common(a, b, toKey);
      expect(r.done).toBeNull();
      expect(r.aIsSet).toBe(true);
      expect(r.bIsSet).toBe(true);
      expect(r.aKey).toBe('a');
      expect(r.bKey).toBe('b');
    });
    test('a set b combination', () => {
      const r = common(a, bc, toKey);
      expect(r.done).toBeNull();
      expect(r.aIsSet).toBe(true);
      expect(r.bIsSet).toBe(false);
      expect(r.aKey).toBe('a');
      expect(r.bKey).toBe('bc');
    });
    test('a combination b set', () => {
      const r = common(ac, b, toKey);
      expect(r.done).toBeNull();
      expect(r.aIsSet).toBe(false);
      expect(r.bIsSet).toBe(true);
      expect(r.aKey).toBe('ac');
      expect(r.bKey).toBe('b');
    });
  });

  describe('aInB', () => {
    test('base', () => {
      const r = common(a, ab);
      expect(aInB(ab, r)).toBe(true);
    });
    test('sets', () => {
      const r = common(a, b);
      expect(aInB(b, r)).toBe(false);
    });
    test('combinations', () => {
      const r = common(ac, bc);
      expect(aInB(bc, r)).toBe(false);
    });
  });

  describe('bInA', () => {
    test('base', () => {
      const r = common(ab, a);
      expect(bInA(ab, r)).toBe(true);
    });
    test('sets', () => {
      const r = common(a, b);
      expect(bInA(a, r)).toBe(false);
    });
    test('combinations', () => {
      const r = common(ac, bc);
      expect(bInA(ac, r)).toBe(false);
    });
  });

  describe('combinedKey', () => {
    // test('a a', () => {
    //   const r = common(a, a, toKey);
    //   since r.done is set, no guarantee
    //   expect(combinedKey(a, a, r)).toBe('a');
    // });
    test('ac a', () => {
      const r = common(ac, ac, toKey);
      expect(combinedKey(ac, ac, r)).toBe('a');
    });
    test('a ac', () => {
      const r = common(a, ac, toKey);
      expect(combinedKey(a, ac, r)).toBe('a');
    });
    test('a b', () => {
      const r = common(a, b, toKey);
      expect(combinedKey(a, a, r)).toBe('a&b');
    });
    test('a bc', () => {
      const r = common(a, bc, toKey);
      expect(combinedKey(a, bc, r)).toBe('a&b');
    });
    test('ac bc', () => {
      const r = common(ac, bc, toKey);
      expect(combinedKey(ac, bc, r)).toBe('a&b');
    });
    test('a ab', () => {
      const r = common(a, ab, toKey);
      expect(combinedKey(a, ab, r)).toBe('a&b');
    });
    test('ab a', () => {
      const r = common(ab, a, toKey);
      expect(combinedKey(ab, a, r)).toBe('a&b');
    });
  });
});

describe('generateDistinctOverlapFunction', () => {
  const as = asSet({ name: 'A', elems: [0, 1, 2, 3, 4] });
  const bs = asSet({ name: 'B', elems: [3, 4, 5, 6] });
  const cs = asSet({ name: 'C', elems: [0, 3, 5, 7, 8] });
  const [a, b, c, ab, ac, abc, bc] = generateCombinations([as, bs, cs], {
    min: 1,
    type: 'distinctIntersection',
    empty: true,
  });

  test('abc', () => {
    const o = generateDistinctOverlapFunction([a, b, c, ab, ac, abc, bc], () => 0);
    expect(o(as, as)).toBe(as.cardinality);
    expect(o(as, bs)).toBe(ab.cardinality + abc.cardinality);
    expect(o(bs, as)).toBe(ab.cardinality + abc.cardinality);
    expect(o(as, a)).toBe(a.cardinality);
    expect(o(a, as)).toBe(a.cardinality);
    expect(o(as, abc)).toBe(abc.cardinality);
    expect(o(as, b)).toBe(0);
    expect(o(as, ab)).toBe(ab.cardinality);

    expect(o(ab, abc)).toBe(0);
    expect(o(bc, abc)).toBe(0);
    expect(o(ac, abc)).toBe(0);
    expect(o(ac, bc)).toBe(0);
    expect(o(a, bc)).toBe(0);
  });
});

describe('generateIntersectionOverlapFunction', () => {
  const as = asSet({ name: 'A', elems: [0, 1, 2, 3, 4] });
  const bs = asSet({ name: 'B', elems: [3, 4, 5, 6] });
  const cs = asSet({ name: 'C', elems: [0, 3, 5, 7, 8] });
  const [a, b, c, ab, ac, abc, bc] = generateCombinations([as, bs, cs], {
    min: 1,
    type: 'intersection',
    empty: true,
  });

  test('abc', () => {
    const o = generateIntersectionOverlapFunction([a, b, c, ab, ac, abc, bc], () => 0);
    expect(o(as, as)).toBe(as.cardinality);
    expect(o(as, bs)).toBe(ab.cardinality);
    expect(o(bs, as)).toBe(ab.cardinality);
    expect(o(as, a)).toBe(a.cardinality);
    expect(o(a, as)).toBe(a.cardinality);
    expect(o(as, abc)).toBe(abc.cardinality);
    expect(o(as, b)).toBe(ab.cardinality);
    expect(o(as, ab)).toBe(ab.cardinality);

    expect(o(ab, abc)).toBe(abc.cardinality);
    expect(o(bc, abc)).toBe(abc.cardinality);
    expect(o(ac, abc)).toBe(abc.cardinality);
    expect(o(ac, bc)).toBe(abc.cardinality);
    expect(o(a, bc)).toBe(abc.cardinality);
  });
});

describe('generateUnionOverlapFunction', () => {
  const as = asSet({ name: 'A', elems: [0, 1, 2, 3, 4] });
  const bs = asSet({ name: 'B', elems: [3, 4, 5, 6] });
  const cs = asSet({ name: 'C', elems: [0, 3, 5, 7, 8] });
  const [a, b, c, ab, ac, abc, bc] = generateCombinations([as, bs, cs], {
    min: 1,
    type: 'union',
    empty: true,
  });

  test('abc', () => {
    const o = generateUnionOverlapFunction([a, b, c, ab, ac, abc, bc], () => 0);
    expect(o(as, as)).toBe(as.cardinality);
    expect(o(as, bs)).toBe(a.cardinality + b.cardinality - ab.cardinality);
    expect(o(bs, as)).toBe(a.cardinality + b.cardinality - ab.cardinality);
    expect(o(as, a)).toBe(a.cardinality);
    expect(o(a, as)).toBe(a.cardinality);
    expect(o(as, abc)).toBe(as.cardinality);
    expect(o(as, b)).toBe(a.cardinality + b.cardinality - ab.cardinality);
    expect(o(as, ab)).toBe(as.cardinality);

    expect(o(ab, abc)).toBe(ab.cardinality);
    expect(o(bc, abc)).toBe(bc.cardinality);
    expect(o(ac, abc)).toBe(ac.cardinality);
    expect(o(ac, bc)).toBe(ac.cardinality + bc.cardinality - abc.cardinality);
    expect(o(a, bc)).toBe(a.cardinality + bc.cardinality - abc.cardinality);
  });
});
