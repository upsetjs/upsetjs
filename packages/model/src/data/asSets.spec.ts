/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import asSets from './asSets';

describe('asSets', () => {
  test('base', () => {
    expect(asSets([])).toStrictEqual([]);
  });

  test('structure', () => {
    const obj = asSets([{ name: 'A', elems: [1, 2] }])[0];
    expect(obj.name).toBe('A');
    expect(obj.elems).toStrictEqual([1, 2]);
    expect(obj.cardinality).toBe(2);
    expect(obj.type).toBe('set');
  });
});
