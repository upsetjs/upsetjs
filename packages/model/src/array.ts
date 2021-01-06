/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

/**
 * compresses an indices array to a string by avoiding increasing indices references.
 * e.g., 1,2,3,4 will become 1+3 (1 followed by 3 increasing numbers)
 * @param arr the array to compress
 */
export function compressIndicesArray(arr: readonly number[]): string {
  if (arr.length === 0) {
    return '';
  }

  const encoded: string[] = [];

  let startIndex = 0;

  const push = (i: number) => {
    if (i === startIndex + 1) {
      encoded.push(arr[startIndex].toString());
    } else if (i === startIndex + 2 && i < 10) {
      // don't save anything (1+1, vs 1,2)
      encoded.push(`${arr[startIndex]},${arr[startIndex + 1]}`);
    } else {
      encoded.push(`${arr[startIndex]}+${i - startIndex - 1}`);
    }
    return i;
  };
  for (let i = 1; i < arr.length; i++) {
    const expected = arr[i - 1] + 1;
    const v = arr[i];
    if (v !== expected) {
      // slice break
      startIndex = push(i);
      startIndex = i;
    }
  }
  push(arr.length);
  return encoded.join(',');
}

/**
 * creates an (compressed) indices array for the given array of elements
 * @param arr the array to compress
 * @param toIndex the element to index function
 */
export function toIndicesArray<T>(
  arr: readonly T[],
  toIndex: (v: T) => number,
  { sortAble, compress = 'auto' }: { sortAble?: boolean; compress?: 'no' | 'yes' | 'auto' } = {}
): string | readonly number[] {
  if (arr.length === 0) {
    return [];
  }
  const base = arr.map((v) => toIndex(v));

  if (compress === 'no') {
    return base;
  }

  if (sortAble) {
    base.sort((a, b) => a - b);
  }
  const encoded = compressIndicesArray(base);
  const baseLength = JSON.stringify(base).length;
  const encodedLength = encoded.length + 2; // for ""

  if (
    encodedLength < baseLength * 0.6 ||
    baseLength - encodedLength > 50 ||
    (compress === 'yes' && encodedLength < baseLength)
  ) {
    // save 40% or more than 50 characters
    return encoded;
  }
  return base;
}

/**
 * reverse operation of `toIndicesArray` by supporting compressed indices notation
 * @param indices the (compressed) indices
 * @param elements the elements to refer by index
 */
export function fromIndicesArray<T>(indices: string | readonly number[], elements: readonly T[]): readonly T[] {
  if (typeof indices === 'string') {
    if (indices.length === 0) {
      return [];
    }
    return indices
      .split(',')
      .map((s) => {
        if (s.includes('+')) {
          const [start, length] = s.split('+').map((si) => Number.parseInt(si, 10));
          return elements.slice(start, start + length + 1);
        }
        return elements[Number.parseInt(s, 10)]!;
      })
      .flat() as T[];
  }
  return indices.map((i) => elements[i]);
}
