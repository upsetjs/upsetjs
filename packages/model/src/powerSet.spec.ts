// import 'jest';
import powerSet, { powerSetRecursive, powerSetNumber, PowerSetOptions } from './powerSet';

function expectS(f: typeof powerSet, arg: number[], options: Partial<PowerSetOptions> = {}) {
  return expect(JSON.stringify(Array.from(f(arg, options)).sort()));
}

test('[]', () => {
  const arg: number[] = [];
  const output = JSON.stringify([[]].sort());
  const options: Partial<PowerSetOptions> = {};
  expectS(powerSet, arg, options).toBe(output);
  expectS(powerSetNumber, arg, options).toBe(output);
  // expectS(powerSetBigInt, arg, options).toBe(output);
  expectS(powerSetRecursive, arg, options).toBe(output);
});

test('[] - min1', () => {
  const arg: number[] = [];
  const output = JSON.stringify([].sort());
  const options: Partial<PowerSetOptions> = { min: 1 };
  expectS(powerSet, arg, options).toBe(output);
  expectS(powerSetNumber, arg, options).toBe(output);
  // expectS(powerSetBigInt, arg, options).toBe(output);
  expectS(powerSetRecursive, arg, options).toBe(output);
});

test('[1,2]', () => {
  const arg: number[] = [1, 2];
  const output = JSON.stringify([[], [1], [2], [1, 2]].sort());
  const options: Partial<PowerSetOptions> = {};
  expectS(powerSet, arg, options).toBe(output);
  expectS(powerSetNumber, arg, options).toBe(output);
  // expectS(powerSetBigInt, arg, options).toBe(output);
  expectS(powerSetRecursive, arg, options).toBe(output);
});

test('[1,2] min:1, max: 1', () => {
  const arg: number[] = [1, 2];
  const output = JSON.stringify([[1], [2]].sort());
  const options: Partial<PowerSetOptions> = { min: 1, max: 1 };
  expectS(powerSet, arg, options).toBe(output);
  expectS(powerSetNumber, arg, options).toBe(output);
  // expectS(powerSetBigInt, arg, options).toBe(output);
  expectS(powerSetRecursive, arg, options).toBe(output);
});

test('[1,2,3]', () => {
  const arg: number[] = [1, 2, 3];
  const output = JSON.stringify([[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]].sort());
  const options: Partial<PowerSetOptions> = {};
  expectS(powerSet, arg, options).toBe(output);
  expectS(powerSetNumber, arg, options).toBe(output);
  // expectS(powerSetBigInt, arg, options).toBe(output);
  expectS(powerSetRecursive, arg, options).toBe(output);
});
