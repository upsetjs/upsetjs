/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

//import 'jest';
// import { TickOptions, NumericScaleTick } from './numeric';
import { toStr } from './log';

// const hor: TickOptions = {
//   orientation: 'horizontal',
//   fontSizeHint: 10,
// };
// const ver: TickOptions = {
//   orientation: 'vertical',
//   fontSizeHint: 10,
// };

// describe('log', () => {
//   test('base', () => {
//     expect(typeof logScale).toBe('function');
//   });
//   test('ticks small', () => {
//     expect(logScale(10, [0, 200], ver).ticks()).toEqual<NumericScaleTick[]>(genTicks(10, 1));
//   });
// });

describe('toStr', () => {
  test('toStr', () => {
    expect(toStr(1)).toBe('1');
    expect(toStr(10)).toBe('10');
    expect(toStr(12)).toBe('12');
    expect(toStr(120)).toBe('120');
    expect(toStr(1000)).toBe('1k');
    expect(toStr(1200)).toBe('1.2k');
    expect(toStr(120000)).toBe('120k');
    expect(toStr(1200000)).toBe('1.2M');
    expect(toStr(1200000000)).toBe('1.2G');
    expect(toStr(12000000000)).toBe('12G');
    expect(toStr(1200000000000)).toBe('1,200G');
  });
});
