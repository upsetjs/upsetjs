/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

/// <reference types="jest" />
import generateCombinations from './generateCombinations';
import asSets from './asSets';
import type { SetCombinationType, ISetCombination, ISets } from '../model';

function expectSet<T>(
  s: ISetCombination<T>,
  type: SetCombinationType,
  name: string,
  elems: readonly T[],
  sets: ISets<T>
) {
  expect(s.type).toBe(type);
  expect(s.name).toBe(name);
  expect(s.elems.slice().sort()).toEqual(elems.slice().sort());
  expect(s.cardinality).toBe(elems.length);
  expect(Array.from(s.sets) as ISets<T>).toStrictEqual(sets);
  expect(s.degree).toBe(sets.length);
}

describe('generateCombinations', () => {
  test('empty', () => {
    const r = generateCombinations([]);
    expect(r).toHaveLength(0);
  });

  describe('single', () => {
    const data = asSets([
      {
        name: 'A',
        elems: [1, 2, 3],
      },
    ]);
    test('intersection', () => {
      const type: SetCombinationType = 'intersection';
      const r = generateCombinations(data, { type });
      expect(r).toHaveLength(1);
      expectSet(r[0], type, 'A', [1, 2, 3], data);
    });
    test('union', () => {
      const type: SetCombinationType = 'union';
      const r = generateCombinations(data, { type });
      expect(r).toHaveLength(1);
      expectSet(r[0], type, 'A', [1, 2, 3], data);
    });
    test('composite', () => {
      const type: SetCombinationType = 'composite';
      const r = generateCombinations(data, { type });
      expect(r).toHaveLength(1);
      expectSet(r[0], type, 'A', [1, 2, 3], data);
    });
    test('distinct', () => {
      const type: SetCombinationType = 'distinctIntersection';
      const r = generateCombinations(data, { type });
      expect(r).toHaveLength(1);
      expectSet(r[0], type, 'A', [1, 2, 3], data);
    });
  });

  describe('two', () => {
    const data = asSets([
      {
        name: 'A',
        elems: [1, 2, 3],
      },
      {
        name: 'B',
        elems: [3, 4],
      },
    ]);
    test('intersection', () => {
      const type: SetCombinationType = 'intersection';
      const r = generateCombinations(data, { type });
      expect(r).toHaveLength(3);
      expectSet(r[0], type, 'A', [1, 2, 3], [data[0]]);
      expectSet(r[1], type, 'B', [3, 4], [data[1]]);
      expectSet(r[2], type, '(A ∩ B)', [3], [data[0], data[1]]);
    });
    test('union', () => {
      const type: SetCombinationType = 'union';
      const r = generateCombinations(data, { type });
      expectSet(r[0], type, 'A', [1, 2, 3], [data[0]]);
      expectSet(r[1], type, 'B', [3, 4], [data[1]]);
      expectSet(r[2], type, '(A ∪ B)', [1, 2, 3, 4], [data[0], data[1]]);
    });
    test('composite', () => {
      const type: SetCombinationType = 'composite';
      const r = generateCombinations(data, { type });
      expect(r).toHaveLength(3);
      expectSet(r[0], type, 'A', [1, 2, 3], [data[0]]);
      expectSet(r[1], type, 'B', [3, 4], [data[1]]);
      expectSet(r[2], type, '(A,B)', [3], [data[0], data[1]]);
    });
    test('distinctIntersection', () => {
      const type: SetCombinationType = 'distinctIntersection';
      const r = generateCombinations(data, { type });
      expect(r).toHaveLength(3);
      expectSet(r[0], type, 'A', [1, 2], [data[0]]);
      expectSet(r[1], type, 'B', [4], [data[1]]);
      expectSet(r[2], type, '(A ∩ B)', [3], [data[0], data[1]]);
    });
  });

  describe('three', () => {
    const data = asSets([
      {
        name: 'A',
        elems: [1, 2, 3, 4],
      },
      {
        name: 'B',
        elems: [3, 4, 5, 6],
      },
      {
        name: 'C',
        elems: [1, 3, 4, 6, 7],
      },
    ]);
    test('intersection', () => {
      const type: SetCombinationType = 'intersection';
      const r = generateCombinations(data, { type });
      expect(r).toHaveLength(7);
      expectSet(r[0], type, 'A', [1, 2, 3, 4], [data[0]]);
      expectSet(r[1], type, 'B', [3, 4, 5, 6], [data[1]]);
      expectSet(r[2], type, 'C', [1, 3, 4, 6, 7], [data[2]]);
      expectSet(r[3], type, '(A ∩ B)', [3, 4], [data[0], data[1]]);
      expectSet(r[4], type, '(A ∩ C)', [1, 3, 4], [data[0], data[2]]);
      expectSet(r[5], type, '(A ∩ B ∩ C)', [3, 4], [data[0], data[1], data[2]]);
      expectSet(r[6], type, '(B ∩ C)', [3, 4, 6], [data[1], data[2]]);
    });
    test('union', () => {
      const type: SetCombinationType = 'union';
      const r = generateCombinations(data, { type });
      expect(r).toHaveLength(7);
      expectSet(r[0], type, 'A', [1, 2, 3, 4], [data[0]]);
      expectSet(r[1], type, 'B', [3, 4, 5, 6], [data[1]]);
      expectSet(r[2], type, 'C', [1, 3, 4, 6, 7], [data[2]]);
      expectSet(r[3], type, '(A ∪ B)', [1, 2, 3, 4, 5, 6], [data[0], data[1]]);
      expectSet(r[4], type, '(A ∪ C)', [1, 2, 3, 4, 6, 7], [data[0], data[2]]);
      expectSet(r[5], type, '(A ∪ B ∪ C)', [1, 2, 3, 4, 5, 6, 7], [data[0], data[1], data[2]]);
      expectSet(r[6], type, '(B ∪ C)', [1, 3, 4, 5, 6, 7], [data[1], data[2]]);
    });
    test('composite', () => {
      const type: SetCombinationType = 'composite';
      const r = generateCombinations(data, { type });
      expect(r).toHaveLength(7);
      expectSet(r[0], type, 'A', [1, 2, 3, 4], [data[0]]);
      expectSet(r[1], type, 'B', [3, 4, 5, 6], [data[1]]);
      expectSet(r[2], type, 'C', [1, 3, 4, 6, 7], [data[2]]);
      expectSet(r[3], type, '(A,B)', [3, 4], [data[0], data[1]]);
      expectSet(r[4], type, '(A,C)', [1, 3, 4], [data[0], data[2]]);
      expectSet(r[5], type, '(A,B,C)', [3, 4], [data[0], data[1], data[2]]);
      expectSet(r[6], type, '(B,C)', [3, 4, 6], [data[1], data[2]]);
    });
    test('distinctIntersection', () => {
      const type: SetCombinationType = 'distinctIntersection';
      const r = generateCombinations(data, { type });
      expect(r).toHaveLength(7 - 1);
      expectSet(r[0], type, 'A', [2], [data[0]]);
      expectSet(r[1], type, 'B', [5], [data[1]]);
      // expectSet(r[2], type, '(A ∩ B)', [], [data[0], data[1]]);
      expectSet(r[2], type, 'C', [7], [data[2]]);
      expectSet(r[3], type, '(A ∩ C)', [1], [data[0], data[2]]);
      expectSet(r[4], type, '(A ∩ B ∩ C)', [3, 4], [data[0], data[1], data[2]]);
      expectSet(r[5], type, '(B ∩ C)', [6], [data[1], data[2]]);
    });
  });

  describe('variant', () => {
    const data = asSets([
      {
        name: 'A',
        elems: [1, 2, 3, 4],
      },
      {
        name: 'B',
        elems: [3, 4, 5, 6],
      },
      {
        name: 'C',
        elems: [1, 3, 4, 6, 7],
      },
      {
        name: 'D',
        elems: [1, 2, 3, 4],
      },
      {
        name: 'E',
        elems: [3, 4, 5, 6],
      },
      {
        name: 'F',
        elems: [1, 3, 4, 6, 7],
      },
    ]);

    expect(generateCombinations(data, { empty: true })).toHaveLength(Math.pow(2, data.length));
    expect(generateCombinations(data, { empty: true, max: 5 })).toHaveLength(Math.pow(2, data.length) - 1);
    expect(generateCombinations(data, { empty: true, min: 1 })).toHaveLength(Math.pow(2, data.length) - 1);
    expect(generateCombinations(data, { empty: true, min: 2 })).toHaveLength(Math.pow(2, data.length) - 1 - 6);
  });

  describe('large', () => {
    const data = asSets([
      {
        name: 'A',
        elems: [1, 2, 3, 4],
      },
      {
        name: 'B',
        elems: [3, 4, 5, 6],
      },
      {
        name: 'C',
        elems: [1, 3, 4, 6, 7],
      },
      {
        name: 'D',
        elems: [1, 2, 3, 4],
      },
      {
        name: 'E',
        elems: [3, 4, 5, 6],
      },
      {
        name: 'F',
        elems: [1, 3, 4, 6, 7],
      },
      {
        name: 'G',
        elems: [1, 3, 4, 6, 7],
      },
      {
        name: 'H',
        elems: [1, 3, 4, 6, 7],
      },
      {
        name: 'I',
        elems: [1, 3, 4, 6, 7],
      },
    ]);

    expect(generateCombinations(data, { empty: true })).toHaveLength(Math.pow(2, data.length));
  });
});
