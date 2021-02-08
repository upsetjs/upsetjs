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

describe('extractCombinations', () => {
  test('base', () => {
    expect(extractCombinations([])).toStrictEqual({ sets: [], combinations: [] });
  });

  describe('single set', () => {
    for (const type of ['intersection', 'distinctIntersection', 'union'] as SetCombinationType[]) {
      test('simple', () => {
        const elems = [{ sets: ['A'] }];
        const { sets: s, combinations: c } = extractCombinations(elems, {
          type,
        });
        expect(s).toHaveLength(1);
        expectSet(s[0], 'A', elems);

        expect(c).toHaveLength(1);
        expectCombination(c[0], type, 'A', elems);
      });
      test('two elems', () => {
        const elems = [{ sets: ['A'] }, { sets: ['A'] }];
        const { sets: s, combinations: c } = extractCombinations(elems, {
          type,
        });
        expect(s).toHaveLength(1);
        expectSet(s[0], 'A', elems);

        expect(c).toHaveLength(1);
        expectCombination(c[0], type, 'A', elems);
      });
      test('two sets', () => {
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
      test('two sets', () => {
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

    test('A&B', () => {
      const elems = [{ sets: ['A'] }, { sets: ['A', 'B'] }];
      const { sets: s, combinations: c } = extractCombinations(elems, {
        type: 'distinctIntersection',
      });
      expect(s).toHaveLength(2);
      expectSet(s[0], 'A', elems);
      expectSet(s[1], 'B', elems.slice(1));

      expect(c).toHaveLength(2);
      expectCombination(c[0], 'distinctIntersection', 'A', elems.slice(0, 1));
      expectCombination(c[1], 'distinctIntersection', 'A ∩ B', elems.slice(1));
    });

    test('A&B', () => {
      const elems = [{ sets: ['A'] }, { sets: ['A', 'B'] }];
      const { sets: s, combinations: c } = extractCombinations(elems, {
        type: 'intersection',
      });
      expect(s).toHaveLength(2);
      expectSet(s[0], 'A', elems);
      expectSet(s[1], 'B', elems.slice(1));

      expect(c).toHaveLength(3);
      expectCombination(c[0], 'intersection', 'A', elems.slice(0, 1));
      expectCombination(c[1], 'intersection', 'B', elems.slice(1));
      expectCombination(c[2], 'intersection', 'A ∩ B', elems.slice(1));
    });
  });
});
