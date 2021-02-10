/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetCombinations, ISetLike, ISets, toKey as toKeyImpl } from '../model';
import { SetOverlap, setOverlapFactory, ISetOverlapFunction } from './setOverlap';

export interface GenerateOverlapLookupOptions<T> {
  toElemKey?(v: T): string;
  what?: keyof SetOverlap;
  compress?: 'no' | 'yes' | 'auto';
}

/**
 * compresses a given line, the idea is to reduce elements with the same value,
 * e.g., 1,2,2,2,2,2,3 is compressed to 1,2=4,3
 */
function compressLine(line: readonly number[]) {
  if (line.length === 0) {
    return '';
  }
  const r: string[] = [];
  let start = line[0];
  let len = 1;
  for (let i = 1; i < line.length; i++) {
    const v = line[i];
    if (v === start) {
      len++;
    } else {
      if (len > 1) {
        r.push(`${start}=${len - 1}`);
      } else if (start === 0) {
        r.push('');
      } else {
        r.push(start.toString());
      }
      start = v;
      len = 1;
    }
  }
  if (len > 1) {
    r.push(`${start}=${len}`);
  } else if (start === 0) {
    r.push('');
  } else {
    r.push(start.toString());
  }

  return r.join(',');
}

function decompressLine(line: string): readonly number[] {
  if (line.length === 0) {
    return [];
  }
  return line
    .split(',')
    .map((v) => {
      if (v === '') {
        return 0;
      }
      if (v.includes('=')) {
        const [value, length] = v.split('=').map((v) => Number.parseInt(v, 10));
        return Array(length + 1).fill(value);
      }
      return Number.parseInt(v, 10);
    })
    .flat();
}

function compressMatrix(matrix: readonly (readonly number[])[]) {
  if (matrix.length === 0) {
    return '';
  }
  const rows = matrix.length;
  const flat = matrix.flat();
  return `${rows};${compressLine(flat)}`;
}

function decompressMatrix(matrix: string): readonly (readonly number[])[] {
  if (matrix.length === 0) {
    return [];
  }
  const [rowsInfo, data] = matrix.split(';');
  const rows = Number.parseInt(rowsInfo, 10);
  const values = decompressLine(data);
  const r: number[][] = [];
  let acc = 0;
  for (let i = rows; i > 0; i--) {
    r.push(values.slice(acc, acc + i));
    acc += i;
  }
  return r;
}

/**
 * generate a (compressed) overlap lookup matrix that can be dumped and later used to lookup overlaps
 * @param sets the sets of the plot
 * @param combinations the set combinations of the plot
 * @param options additional options
 */
export function generateOverlapLookup<T>(
  sets: ISets<T>,
  combinations: ISetCombinations<T>,
  { toElemKey, what = 'intersection', compress = 'auto' }: GenerateOverlapLookupOptions<T> = {}
): readonly (readonly number[])[] | string {
  // generate a distance matrix of all combinations
  const data = (sets as ISetLike<T>[]).concat(combinations);

  function overlapF(set: ISetLike<T>) {
    if (set.overlap) {
      return set.overlap;
    }
    const f = setOverlapFactory(set.elems, toElemKey);
    return (v: ISetLike<T>) => {
      if (v.overlap) {
        return v.overlap(set);
      }
      return f(v.elems)[what];
    };
  }

  // diagonal matrix [i][j - i - 1] = distance
  const matrix = data.map((set, i) => {
    const overlap = overlapF(set);
    const r: number[] = [];
    for (let j = i + 1; j < data.length; j++) {
      r.push(overlap(data[j]));
    }
    return r;
  });
  matrix.pop(); // last is empty
  if (compress === 'no') {
    return matrix;
  }
  const compressed = compressMatrix(matrix);
  if (compress === 'yes') {
    return compressed;
  }
  const encodedLength = JSON.stringify(matrix).length;
  const compressedLength = compressed.length + 2;
  return compressedLength < encodedLength * 0.6 ? compressed : matrix;
}

/**
 * uses the given overlap lookup function to generate a compute and indices functions
 * @param matrix the compressed overlap matrix
 * @param sets the sets of the plot
 * @param combinations the set combinations of the plot
 * @param toKey
 */
export function generateOverlapLookupFunction<T>(
  matrix: readonly (readonly number[])[] | string,
  sets: ISets<T>,
  combinations: ISetCombinations<T>,
  toKey: (v: ISetLike<T>) => string = toKeyImpl
): { setIndex: Map<string, number>; compute: ISetOverlapFunction<T>; combinationIndex: Map<string, number> } {
  const lookup = typeof matrix == 'string' ? decompressMatrix(matrix) : matrix;
  const setIndex = new Map(sets.map((set, i) => [toKey(set), i]));
  const combinationIndex = new Map(combinations.map((set, i) => [toKey(set), i + sets.length]));

  const compute: ISetOverlapFunction<T> = (a, b) => {
    if (a === b) {
      return a.cardinality;
    }
    const aKey = toKey(a);
    const bKey = toKey(b);
    const aIndex = setIndex.has(aKey) ? setIndex.get(aKey)! : combinationIndex.get(aKey)!;
    const bIndex = setIndex.has(bKey) ? setIndex.get(bKey)! : combinationIndex.get(bKey)!;

    if (aIndex === bIndex) {
      return a.cardinality;
    }
    // diagonal matrix [i][j - i - 1] = distance
    const row = Math.min(aIndex, bIndex);
    const col = Math.max(aIndex, bIndex) - row - 1;
    if (row < 0 || row >= lookup.length || col < 0 || col >= lookup[row].length) {
      return 0;
    }
    return lookup[row][col];
  };

  return {
    setIndex,
    compute,
    combinationIndex,
  };
}
