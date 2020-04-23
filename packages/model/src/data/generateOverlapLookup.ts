import { ISetCombinations, ISetLike, ISets, toKey as toKeyImpl } from '../model';
import { SetOverlap, setOverlapFactory } from './setOverlap';

export declare type GenerateOverlapLookupOptions<T> = {
  toElemKey?(v: T): string;
  what?: keyof SetOverlap;
  compress?: 'no' | 'yes' | 'auto';
};

function compressLine(line: ReadonlyArray<number>) {
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
      } else {
        r.push(start.toString());
      }
      start = v;
      len = 1;
    }
  }
  if (len > 1) {
    r.push(`${start}=${len}`);
  } else {
    r.push(start.toString());
  }

  return r.join(',');
}

function decompressLine(line: string): ReadonlyArray<number> {
  if (line.length === 0) {
    return [];
  }
  return line
    .split(',')
    .map((v) => {
      if (v.includes('=')) {
        const [value, length] = v.split('=').map((v) => Number.parseInt(v, 10));
        return Array(length + 1).fill(value);
      }
      return Number.parseInt(v, 10);
    })
    .flat();
}

function compressMatrix(matrix: ReadonlyArray<ReadonlyArray<number>>) {
  if (matrix.length === 0) {
    return '';
  }
  const rows = matrix.length;
  const flat = matrix.flat();
  return `${rows};${compressLine(flat)}`;
}

function decompressMatrix(matrix: string): ReadonlyArray<ReadonlyArray<number>> {
  if (matrix.length === 0) {
    return [];
  }
  const [rowsInfo, data] = matrix.split(';');
  const rows = Number.parseInt(rowsInfo, 10);
  const values = decompressLine(data);
  const r: number[][] = [];
  let acc = 0;
  for (let i = rows - 1; i > 0; i--) {
    r.push(values.slice(acc, i));
    acc += i;
  }
  return r;
}

export function generateOverlapLookup<T>(
  sets: ISets<T>,
  combinations: ISetCombinations<T>,
  { toElemKey, what = 'intersection', compress = 'auto' }: GenerateOverlapLookupOptions<T> = {}
): ReadonlyArray<ReadonlyArray<number>> | string {
  // generate a distnace matrix of all combinations
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

export function generateOverlapLookupFunction<T>(
  matrix: ReadonlyArray<ReadonlyArray<number>> | string,
  sets: ISets<T>,
  combinations: ISetCombinations<T>,
  toKey: (v: ISetLike<T>) => string = toKeyImpl
) {
  const lookup = typeof matrix == 'string' ? decompressMatrix(matrix) : matrix;
  const setIndex = new Map(sets.map((set, i) => [toKey(set), i]));
  const combinationIndex = new Map(combinations.map((set, i) => [toKey(set), i + sets.length]));

  const compute = (a: ISetLike<T>, b: ISetLike<T>) => {
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
