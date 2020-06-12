/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

/// <reference types="jest" />
import generateCombinations from './generateCombinations2';
import generateCombinationsOld from './generateCombinations';
import asSets from './asSets';
import { SetCombinationType, ISetCombination, ISets, ISetCombinations } from '../model';
import extractSets from './extractSets';

function expectSet<T>(
  s: ISetCombination<T>,
  type: SetCombinationType,
  name: string,
  elems: ReadonlyArray<T>,
  sets: ISets<T>
) {
  expect(s.name).toBe(name);
  expect(s.elems.slice().sort()).toEqual(elems.slice().sort());
  expect(s.cardinality).toBe(elems.length);
  expect(s.type).toBe(type);
  expect(Array.from(s.sets)).toStrictEqual(sets);
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

describe('benchmark', () => {
  function generate(numItems: number, numSets: number) {
    const sets = Array(numSets)
      .fill(0)
      .map((_, i) => `s${i}`);
    const items = Array(numItems)
      .fill(0)
      .map((_, i) => ({
        name: `e${i}`,
        sets: sets.filter(() => Math.random() < 1 / sets.length),
      }));

    return extractSets(items);
  }

  describe('100', () => {
    describe('4', () => {
      const sets = generate(100, 4);
      let r: ISetCombinations<any> = [];
      let r2: ISetCombinations<any> = [];
      test('new', () => {
        r = generateCombinations(sets, { order: 'name' });
      });
      test('old', () => {
        r2 = generateCombinationsOld(sets, { order: 'name' });
      });
      test('compare', () => {
        expect(r).toEqual(r2);
      });
    });
    describe('6', () => {
      const sets = generate(100, 6);
      let r: ISetCombinations<any> = [];
      let r2: ISetCombinations<any> = [];
      test('new', () => {
        r = generateCombinations(sets, { order: 'name' });
      });
      test('old', () => {
        r2 = generateCombinationsOld(sets, { order: 'name' });
      });
      test('compare', () => {
        expect(r).toEqual(r2);
      });
    });
    describe('8', () => {
      const sets = generate(100, 8);
      let r: ISetCombinations<any> = [];
      let r2: ISetCombinations<any> = [];
      test('new', () => {
        r = generateCombinations(sets, { order: 'name' });
      });
      test('old', () => {
        r2 = generateCombinationsOld(sets, { order: 'name' });
      });
      test('compare', () => {
        expect(r).toEqual(r2);
      });
    });
    describe('10', () => {
      const sets = generate(100, 10);
      let r: ISetCombinations<any> = [];
      let r2: ISetCombinations<any> = [];
      test('new', () => {
        r = generateCombinations(sets, { order: 'name' });
      });
      test('old', () => {
        r2 = generateCombinationsOld(sets, { order: 'name' });
      });
      test('compare', () => {
        expect(r).toEqual(r2);
      });
    });
  });

  describe('10000', () => {
    describe('4', () => {
      const sets = generate(10000, 4);
      let r: ISetCombinations<any> = [];
      let r2: ISetCombinations<any> = [];
      test('new', () => {
        r = generateCombinations(sets, { order: 'name' });
      });
      test('old', () => {
        r2 = generateCombinationsOld(sets, { order: 'name' });
      });
      test('compare', () => {
        expect(r).toEqual(r2);
      });
    });
    describe('6', () => {
      const sets = generate(10000, 6);
      let r: ISetCombinations<any> = [];
      let r2: ISetCombinations<any> = [];
      test('new', () => {
        r = generateCombinations(sets, { order: 'name' });
      });
      test('old', () => {
        r2 = generateCombinationsOld(sets, { order: 'name' });
      });
      test('compare', () => {
        expect(r).toEqual(r2);
      });
    });
    describe('8', () => {
      const sets = generate(10000, 8);
      let r: ISetCombinations<any> = [];
      let r2: ISetCombinations<any> = [];
      test('new', () => {
        r = generateCombinations(sets, { order: 'name' });
      });
      test('old', () => {
        r2 = generateCombinationsOld(sets, { order: 'name' });
      });
      test('compare', () => {
        expect(r).toEqual(r2);
      });
    });
    describe('10', () => {
      const sets = generate(10000, 10);
      let r: ISetCombinations<any> = [];
      let r2: ISetCombinations<any> = [];
      test('new', () => {
        r = generateCombinations(sets, { order: 'name' });
      });
      test('old', () => {
        r2 = generateCombinationsOld(sets, { order: 'name' });
      });
      test('compare', () => {
        expect(r).toEqual(r2);
      });
    });
    describe('16', () => {
      const sets = generate(10000, 16);
      let r: ISetCombinations<any> = [];
      let r2: ISetCombinations<any> = [];
      test('new', () => {
        r = generateCombinations(sets, { order: 'name' });
      });
      test('old', () => {
        r2 = generateCombinationsOld(sets, { order: 'name' });
      });
      test('compare', () => {
        expect(r).toEqual(r2);
      });
    });
  });

  describe('1000000', () => {
    describe('4', () => {
      const sets = generate(1000000, 4);
      let r: ISetCombinations<any> = [];
      let r2: ISetCombinations<any> = [];
      test('new', () => {
        r = generateCombinations(sets, { order: 'name' });
      });
      test('old', () => {
        r2 = generateCombinationsOld(sets, { order: 'name' });
      });
      test('compare', () => {
        expect(r).toEqual(r2);
      });
    });
    // describe('6', () => {
    //   const sets = generate(1000000, 6);
    //   let r: ISetCombinations<any> = [];
    //   let r2: ISetCombinations<any> = [];
    //   test('new', () => {
    //     r = generateCombinations(sets, { order: 'name' });
    //   });
    //   test('old', () => {
    //     r2 = generateCombinationsOld(sets, { order: 'name' });
    //   });
    //   test('compare', () => {
    //     expect(r).toEqual(r2);
    //   });
    // });
    // describe('8', () => {
    //   const sets = generate(1000000, 8);
    //   let r: ISetCombinations<any> = [];
    //   let r2: ISetCombinations<any> = [];
    //   test('new', () => {
    //     r = generateCombinations(sets, { order: 'name' });
    //   });
    //   test('old', () => {
    //     r2 = generateCombinationsOld(sets, { order: 'name' });
    //   });
    //   test('compare', () => {
    //     expect(r).toEqual(r2);
    //   });
    // });
    // describe('10', () => {
    //   const sets = generate(1000000, 10);
    //   let r: ISetCombinations<any> = [];
    //   let r2: ISetCombinations<any> = [];
    //   test('new', () => {
    //     r = generateCombinations(sets, { order: 'name' });
    //   });
    //   test('old', () => {
    //     r2 = generateCombinationsOld(sets, { order: 'name' });
    //   });
    //   test('compare', () => {
    //     expect(r).toEqual(r2);
    //   });
    // });
    //   describe('20', () => {
    //     const sets = generate(1000000, 20);
    //     let r: ISetCombinations<any> = [];
    //     let r2: ISetCombinations<any> = [];
    //     test('new', () => {
    //       r = generateCombinations(sets, { order: 'name' });
    //     });
    //     test('old', () => {
    //       r2 = generateCombinationsOld(sets, { order: 'name' });
    //     });
    //     test('compare', () => {
    //       expect(r).toEqual(r2);
    //     });
    //   });
  });
});
