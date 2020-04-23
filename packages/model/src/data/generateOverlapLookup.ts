import { ISetCombinations, ISetLike, ISets, toKey as toKeyImpl } from '../model';
import { SetOverlap, setOverlapFactory } from './setOverlap';

export declare type GenerateOverlapLookupOptions<T> = {
  toElemKey?(v: T): string;
  what?: keyof SetOverlap;
};

export function generateOverlapLookup<T>(
  sets: ISets<T>,
  combinations: ISetCombinations<T>,
  { toElemKey, what = 'intersection' }: GenerateOverlapLookupOptions<T> = {}
): ReadonlyArray<ReadonlyArray<number>> {
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

  // diagonal matrix [i][j - 1] = distance
  return data.map((set, i) => {
    const overlap = overlapF(set);
    const r: number[] = [];
    for (let j = i + 1; j < data.length; j++) {
      r.push(overlap(data[j]));
    }
    return r;
  });
}

export function generateOverlapLookupFunction<T>(
  lookup: ReadonlyArray<ReadonlyArray<number>>,
  sets: ISets<T>,
  combinations: ISetCombinations<T>,
  toKey: (v: ISetLike<T>) => string = toKeyImpl
) {
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
    const row = Math.min(aIndex, bIndex);
    const col = Math.max(aIndex, bIndex) - 1;
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
