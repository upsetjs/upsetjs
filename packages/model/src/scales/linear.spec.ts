/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

// import 'jest';
import { TickOptions, NumericScaleTick, genTicks } from './numeric';
import { niceFactors, linearScale, range } from './linear';

// const hor: TickOptions = {
//   orientation: 'horizontal',
//   fontSizeHint: 10,
// };
const ver: TickOptions = {
  orientation: 'vertical',
  fontSizeHint: 10,
};

describe('niceFactors', () => {
  test('factors', () => {
    expect(niceFactors(2)).toEqual([1, 2]);
    expect(niceFactors(10)).toEqual([1, 2, 5, 10]);
    expect(niceFactors(20)).toEqual([2, 5, 10]);
    expect(niceFactors(50)).toEqual([5, 10, 20, 50]);
    expect(niceFactors(100)).toEqual([10, 20, 50, 100]);
    expect(niceFactors(1000)).toEqual([100, 200, 500, 1000]);
    expect(niceFactors(1232)).toEqual([200, 500, 1000]);
    expect(niceFactors(1700)).toEqual([200, 500, 1000]);
    expect(niceFactors(3700)).toEqual([500, 1000, 2000]);
  });
});

describe('linear', () => {
  test('base', () => {
    expect(typeof linearScale).toBe('function');
  });
  test('ticks small', () => {
    expect(linearScale(10, [0, 200], ver).ticks()).toEqual<NumericScaleTick[]>(genTicks(range(10)));
    expect(linearScale(10, [0, 100], ver).ticks()).toEqual<NumericScaleTick[]>(genTicks(range(10, 2)));
  });
  test('ticks alternating', () => {
    expect(linearScale(18, [0, 200], ver).ticks()).toEqual<NumericScaleTick[]>(genTicks(range(18, 2)));
  });
});
