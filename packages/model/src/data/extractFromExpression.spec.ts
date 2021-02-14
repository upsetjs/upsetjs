/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */
/// <reference types="jest" />
import extractFromExpression from './extractFromExpression';

describe('extractFromExpression', () => {
  test('base', () => {
    expect(extractFromExpression([])).toEqual({ sets: [], combinations: [] });
  });

  test('single', () => {
    const { sets, combinations } = extractFromExpression([
      {
        cardinality: 10,
        sets: ['A'],
      },
    ]);

    expect(sets).toHaveLength(1);
    expect(sets[0].name).toBe('A');
    expect(sets[0].cardinality).toBe(10);
    // expect(sets[0].overlap!(sets[0])).toBe(10);

    expect(combinations).toHaveLength(1);
    expect(combinations[0].name).toBe('A');
    expect(combinations[0].cardinality).toBe(10);
    expect(Array.from(combinations[0].sets)).toEqual([sets[0]]);
  });

  test('single distinct', () => {
    const { sets, combinations } = extractFromExpression(
      [
        {
          cardinality: 10,
          sets: ['A'],
        },
      ],
      {
        type: 'distinctIntersection',
      }
    );

    expect(sets).toHaveLength(1);
    expect(sets[0].name).toBe('A');
    expect(sets[0].cardinality).toBe(10);

    expect(combinations).toHaveLength(1);
    expect(combinations[0].name).toBe('A');
    expect(combinations[0].cardinality).toBe(10);
    expect(Array.from(combinations[0].sets)).toEqual([sets[0]]);
  });

  test('two', () => {
    const { sets, combinations } = extractFromExpression([
      {
        cardinality: 10,
        sets: ['A'],
      },
      {
        cardinality: 5,
        sets: ['B'],
      },
      {
        cardinality: 2,
        sets: ['A', 'B'],
      },
    ]);

    expect(sets).toHaveLength(2);
    expect(sets[0].name).toBe('A');
    expect(sets[0].cardinality).toBe(10);
    expect(sets[1].name).toBe('B');
    expect(sets[1].cardinality).toBe(5);

    expect(combinations).toHaveLength(3);
    expect(combinations[0].name).toBe('A');
    expect(combinations[0].cardinality).toBe(10);
    expect(Array.from(combinations[0].sets)).toEqual([sets[0]]);
    expect(combinations[1].name).toBe('B');
    expect(combinations[1].cardinality).toBe(5);
    expect(Array.from(combinations[1].sets)).toEqual([sets[1]]);
    expect(combinations[2].name).toBe('A ∩ B');
    expect(combinations[2].cardinality).toBe(2);
    expect(Array.from(combinations[2].sets)).toEqual([sets[0], sets[1]]);
  });

  test('two distinct', () => {
    const { sets, combinations } = extractFromExpression(
      [
        {
          cardinality: 10,
          sets: ['A'],
        },
        {
          cardinality: 5,
          sets: ['B'],
        },
        {
          cardinality: 2,
          sets: ['A', 'B'],
        },
      ],
      {
        type: 'distinctIntersection',
      }
    );

    expect(sets).toHaveLength(2);
    expect(sets[0].name).toBe('A');
    expect(sets[0].cardinality).toBe(12);
    expect(sets[1].name).toBe('B');
    expect(sets[1].cardinality).toBe(7);

    expect(combinations).toHaveLength(3);
    expect(combinations[0].name).toBe('A');
    expect(combinations[0].cardinality).toBe(10);
    expect(Array.from(combinations[0].sets)).toEqual([sets[0]]);
    expect(combinations[1].name).toBe('B');
    expect(combinations[1].cardinality).toBe(5);
    expect(Array.from(combinations[1].sets)).toEqual([sets[1]]);
    expect(combinations[2].name).toBe('A ∩ B');
    expect(combinations[2].cardinality).toBe(2);
    expect(Array.from(combinations[2].sets)).toEqual([sets[0], sets[1]]);
  });
});
