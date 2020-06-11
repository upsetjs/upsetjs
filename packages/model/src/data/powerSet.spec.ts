/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

// import 'jest';
import powerSet, { powerSetRecursive, powerSetNumber, PowerSetOptions } from './powerSet';

function expectPowerSet(arg: number[], options: Partial<PowerSetOptions> = {}) {
  let arr: ReadonlyArray<number>[] = [];
  powerSet(arg, options).forEach((s) => arr.push(s));
  return expect(JSON.stringify(arr.sort()));
}

function expectS(f: typeof powerSetNumber, arg: number[], options: Partial<PowerSetOptions> = {}) {
  let arr: ReadonlyArray<number>[] = [];
  f(arg, (s) => arr.push(s), options);
  return expect(JSON.stringify(arr.sort()));
}

describe('powerSet', () => {
  test('[]', () => {
    const arg: number[] = [];
    const output = JSON.stringify([[]].sort());
    const options: Partial<PowerSetOptions> = {};
    expectPowerSet(arg, options).toBe(output);
    expectS(powerSetNumber, arg, options).toBe(output);
    // expectS(powerSetBigInt, arg, options).toBe(output);
    expectS(powerSetRecursive, arg, options).toBe(output);
  });

  test('[] - min1', () => {
    const arg: number[] = [];
    const output = JSON.stringify([].sort());
    const options: Partial<PowerSetOptions> = { min: 1 };
    expectPowerSet(arg, options).toBe(output);
    expectS(powerSetNumber, arg, options).toBe(output);
    // expectS(powerSetBigInt, arg, options).toBe(output);
    expectS(powerSetRecursive, arg, options).toBe(output);
  });

  test('[1,2]', () => {
    const arg: number[] = [1, 2];
    const output = JSON.stringify([[], [1], [2], [1, 2]].sort());
    const options: Partial<PowerSetOptions> = {};
    expectPowerSet(arg, options).toBe(output);
    expectS(powerSetNumber, arg, options).toBe(output);
    // expectS(powerSetBigInt, arg, options).toBe(output);
    expectS(powerSetRecursive, arg, options).toBe(output);
  });

  test('[1,2] min:1, max: 1', () => {
    const arg: number[] = [1, 2];
    const output = JSON.stringify([[1], [2]].sort());
    const options: Partial<PowerSetOptions> = { min: 1, max: 1 };
    expectPowerSet(arg, options).toBe(output);
    expectS(powerSetNumber, arg, options).toBe(output);
    // expectS(powerSetBigInt, arg, options).toBe(output);
    expectS(powerSetRecursive, arg, options).toBe(output);
  });

  test('[1,2,3]', () => {
    const arg: number[] = [1, 2, 3];
    const output = JSON.stringify([[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]].sort());
    const options: Partial<PowerSetOptions> = {};
    expectPowerSet(arg, options).toBe(output);
    expectS(powerSetNumber, arg, options).toBe(output);
    // expectS(powerSetBigInt, arg, options).toBe(output);
    expectS(powerSetRecursive, arg, options).toBe(output);
  });
});
