/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

/// <reference types="jest" />
import type { ISet, ISetCombination, SetCombinationType } from 'src/model';
import extractCombinations from './extractCombinations';

function expectSet<T>(s: ISet<T>, name: string, elems: readonly T[]) {
  expect(s.type).toBe('set');
  expect(s.name).toBe(name);
  expect(s.elems.slice().sort()).toEqual(elems.slice().sort());
  expect(s.cardinality).toBe(elems.length);
}
function expectCombination<T>(s: ISetCombination<T>, type: SetCombinationType, name: string, elems: readonly T[]) {
  expect(s.type).toBe(type);
  expect(s.name).toBe(name);
  expect(s.elems.slice().sort()).toEqual(elems.slice().sort());
  expect(s.cardinality).toBe(elems.length);
}

function fromSets(sets: { name: string; elems: number[] }[]) {
  const elems: { i: number; sets: string[] }[] = [];
  const byKey = new Map<number, { i: number; sets: string[] }>();

  for (const set of sets) {
    for (const i of set.elems) {
      if (byKey.has(i)) {
        const elem = byKey.get(i)!;
        elem.sets.push(set.name);
      } else {
        const elem = { i, sets: [set.name] };
        byKey.set(i, elem);
        elems.push(elem);
      }
    }
  }
  return { elems, byKey: byKey.get.bind(byKey) };
}

describe('extractCombinations', () => {
  test('base', () => {
    expect(extractCombinations([])).toStrictEqual({ sets: [], combinations: [] });
  });

  describe('single set', () => {
    for (const type of ['intersection', 'distinctIntersection', 'union'] as SetCombinationType[]) {
      test(`${type} simple`, () => {
        const elems = [{ sets: ['A'] }];
        const { sets: s, combinations: c } = extractCombinations(elems, {
          type,
        });
        expect(s).toHaveLength(1);
        expectSet(s[0], 'A', elems);

        expect(c).toHaveLength(1);
        expectCombination(c[0], type, 'A', elems);
      });
      test(`${type} two elems`, () => {
        const elems = [{ sets: ['A'] }, { sets: ['A'] }];
        const { sets: s, combinations: c } = extractCombinations(elems, {
          type,
        });
        expect(s).toHaveLength(1);
        expectSet(s[0], 'A', elems);

        expect(c).toHaveLength(1);
        expectCombination(c[0], type, 'A', elems);
      });
      test(`${type} two sets`, () => {
        const elems = [{ sets: ['A'] }, { sets: ['B'] }];
        const { sets: s, combinations: c } = extractCombinations(elems, {
          type,
        });
        expect(s).toHaveLength(2);
        expectSet(s[0], 'A', elems.slice(0, 1));
        expectSet(s[1], 'B', elems.slice(1));

        expect(c).toHaveLength(2);
        expectCombination(c[0], type, 'A', elems.slice(0, 1));
        expectCombination(c[1], type, 'B', elems.slice(1));
      });
    }
  });

  describe('two', () => {
    const { elems, byKey } = fromSets([
      {
        name: 'A',
        elems: [1, 2, 3],
      },
      {
        name: 'B',
        elems: [3, 4],
      },
    ]);
    // test('intersection', () => {
    //   const type: SetCombinationType = 'intersection';
    //   const r = extractCombinations(elems, { type, setOrder: 'name', combinationOrder: ['degree', 'name'] }).combinations;
    //   expect(r).toHaveLength(3);
    //   expectCombination(r[0], type, 'A', [1, 2, 3].map(byKey));
    //   expectCombination(r[1], type, 'B', [3, 4].map(byKey));
    //   expectCombination(r[2], type, '(A ∩ B)', [3].map(byKey));
    // });
    // test('union', () => {
    //   const type: SetCombinationType = 'union';
    //   const r = extractCombinations(elems, { type, setOrder: 'name', combinationOrder: ['degree', 'name'] }).combinations;
    //   expectCombination(r[0], type, 'A', [1, 2, 3].map(byKey));
    //   expectCombination(r[1], type, 'B', [3, 4].map(byKey));
    //   expectCombination(r[2], type, '(A ∪ B)', [1, 2, 3, 4].map(byKey));
    // });
    // test('composite', () => {
    //   const type: SetCombinationType = 'composite';
    //   const r = extractCombinations(elems, { type, setOrder: 'name', combinationOrder: ['degree', 'name'] }).combinations;
    //   expect(r).toHaveLength(3);
    //   expectCombination(r[0], type, 'A', [1, 2, 3].map(byKey));
    //   expectCombination(r[1], type, 'B', [3, 4].map(byKey));
    //   expectCombination(r[2], type, '(A,B)', [3].map(byKey));
    // });
    test('distinctIntersection', () => {
      const type: SetCombinationType = 'distinctIntersection';
      const r = extractCombinations(elems, { type, setOrder: 'name', combinationOrder: ['degree', 'name'] })
        .combinations;
      expect(r).toHaveLength(3);
      expectCombination(r[0], type, 'A', [1, 2].map(byKey));
      expectCombination(r[1], type, 'B', [4].map(byKey));
      expectCombination(r[2], type, '(A ∩ B)', [3].map(byKey));
    });
  });

  describe('three', () => {
    const { elems, byKey } = fromSets([
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
    // test('intersection', () => {
    //   const type: SetCombinationType = 'intersection';
    //   const r = extractCombinations(elems, { type, setOrder: 'name', combinationOrder: ['degree', 'name'] }).combinations;
    //   expect(r).toHaveLength(7);
    //   expectCombination(r[0], type, 'A', [1, 2, 3, 4].map(byKey));
    //   expectCombination(r[1], type, 'B', [3, 4, 5, 6].map(byKey));
    //   expectCombination(r[2], type, 'C', [1, 3, 4, 6, 7].map(byKey));
    //   expectCombination(r[3], type, '(A ∩ B)', [3, 4].map(byKey));
    //   expectCombination(r[4], type, '(A ∩ C)', [1, 3, 4].map(byKey));
    //   expectCombination(r[5], type, '(A ∩ B ∩ C)', [3, 4].map(byKey));
    //   expectCombination(r[6], type, '(B ∩ C)', [3, 4, 6].map(byKey));
    // });
    // test('union', () => {
    //   const type: SetCombinationType = 'union';
    //   const r = extractCombinations(elems, { type, setOrder: 'name', combinationOrder: ['degree', 'name'] }).combinations;
    //   expect(r).toHaveLength(7);
    //   expectCombination(r[0], type, 'A', [1, 2, 3, 4].map(byKey));
    //   expectCombination(r[1], type, 'B', [3, 4, 5, 6].map(byKey));
    //   expectCombination(r[2], type, 'C', [1, 3, 4, 6, 7].map(byKey));
    //   expectCombination(r[3], type, '(A ∪ B)', [1, 2, 3, 4, 5, 6].map(byKey));
    //   expectCombination(r[4], type, '(A ∪ C)', [1, 2, 3, 4, 6, 7].map(byKey));
    //   expectCombination(r[5], type, '(A ∪ B ∪ C)', [1, 2, 3, 4, 5, 6, 7].map(byKey));
    //   expectCombination(r[6], type, '(B ∪ C)', [1, 3, 4, 5, 6, 7].map(byKey));
    // });
    // test('composite', () => {
    //   const type: SetCombinationType = 'composite';
    //   const r = extractCombinations(elems, { type, setOrder: 'name', combinationOrder: ['degree', 'name'] }).combinations;
    //   expect(r).toHaveLength(7);
    //   expectCombination(r[0], type, 'A', [1, 2, 3, 4].map(byKey));
    //   expectCombination(r[1], type, 'B', [3, 4, 5, 6].map(byKey));
    //   expectCombination(r[2], type, 'C', [1, 3, 4, 6, 7].map(byKey));
    //   expectCombination(r[3], type, '(A,B)', [3, 4].map(byKey));
    //   expectCombination(r[4], type, '(A,C)', [1, 3, 4].map(byKey));
    //   expectCombination(r[5], type, '(A,B,C)', [3, 4].map(byKey));
    //   expectCombination(r[6], type, '(B,C)', [3, 4, 6].map(byKey));
    // });
    test('distinctIntersection', () => {
      const type: SetCombinationType = 'distinctIntersection';
      const r = extractCombinations(elems, { type, setOrder: 'name', combinationOrder: ['degree', 'name'] })
        .combinations;
      expect(r).toHaveLength(7 - 1);
      expectCombination(r[0], type, 'A', [2].map(byKey));
      expectCombination(r[1], type, 'B', [5].map(byKey));
      // expectCombination(r[2], type, '(A ∩ B)', [], [data[0], data[1]]);
      expectCombination(r[2], type, 'C', [7].map(byKey));
      expectCombination(r[3], type, '(A ∩ C)', [1].map(byKey));
      expectCombination(r[4], type, '(B ∩ C)', [6].map(byKey));
      expectCombination(r[5], type, '(A ∩ B ∩ C)', [3, 4].map(byKey));
    });
  });
});
