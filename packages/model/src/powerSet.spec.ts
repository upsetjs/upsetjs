// import 'jest';
import powerSet from './powerSet';

test('basic', () => {
  expect(Array.from(powerSet([] as number[]))).toStrictEqual([[]]);
  expect(Array.from(powerSet([1]))).toStrictEqual([[], [1]]);
  expect(Array.from(powerSet([1], { min: 1 }))).toStrictEqual([[1]]);
});

test('2', () => {
  expect(Array.from(powerSet([1, 2]))).toStrictEqual([[], [1], [2], [1, 2]]);
  expect(Array.from(powerSet([1, 2], { min: 1, max: 1 }))).toStrictEqual([[1], [2]]);
});

test('3', () => {
  expect(Array.from(powerSet([1, 2, 3]))).toStrictEqual([[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]);
});
