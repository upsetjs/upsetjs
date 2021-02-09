/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

// import 'jest';
import extractSets from './extractSets';

describe('extractSets', () => {
  test('base', () => {
    expect(extractSets([])).toStrictEqual([]);
  });

  test('simple', () => {
    const elems = [{ sets: ['A'] }];
    const s = extractSets(elems);
    expect(s).toHaveLength(1);

    expect(s[0].name).toBe('A');
    expect(s[0].type).toBe('set');
    expect(s[0].cardinality).toBe(1);
    expect(s[0].elems).toStrictEqual(elems);
  });

  test('two', () => {
    const elems = [{ sets: ['A'] }, { sets: ['A', 'B'] }];
    const s = extractSets(elems);
    expect(s).toHaveLength(2);

    const s0 = s[0];
    expect(s0.name).toBe('A');
    expect(s0.type).toBe('set');
    expect(s0.cardinality).toBe(2);
    expect(s0.elems).toStrictEqual(elems);

    const s1 = s[1];
    expect(s1.name).toBe('B');
    expect(s1.type).toBe('set');
    expect(s1.cardinality).toBe(1);
    expect(s1.elems).toStrictEqual(elems.slice(1));
  });
});
