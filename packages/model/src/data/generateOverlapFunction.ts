/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetCombination, ISetCombinations, ISetLike, toKey as toDefaultKey } from '../model';
import { isSet } from '../validators';
import type { ISetOverlapFunction } from './setOverlap';

interface CommonInfo {
  done: null | number;
  aKey: string;
  bKey: string;
  aIsSet: boolean;
  bIsSet: boolean;
  toKey: (set: ISetLike<unknown>) => string;
}

function isUniverse(s: ISetCombination<any>) {
  return s.sets.size === 0;
}

/**
 * common compare helper
 * ! when done is set i.e., not null there is no guarantee for any other value
 * @param a
 * @param b
 * @param toKey
 */
export function common<T>(a: ISetLike<T>, b: ISetLike<T>, toKey = toDefaultKey) {
  const r: CommonInfo = {
    done: null,
    aKey: '',
    bKey: '',
    aIsSet: false,
    bIsSet: false,
    toKey,
  };
  if (a === b) {
    r.done = a.cardinality;
    return r;
  }
  if (a.cardinality === 0 || b.cardinality === 0) {
    r.done = 0;
    return r;
  }
  r.aKey = toKey(a);
  r.bKey = toKey(b);
  if (r.aKey === r.bKey) {
    r.done = a.cardinality;
    return r;
  }
  r.aIsSet = isSet(a);
  r.bIsSet = isSet(b);

  if ((!r.aIsSet && isUniverse(a as ISetCombination<T>)) || (!r.bIsSet && isUniverse(b as ISetCombination<T>))) {
    // no overlap to the universe which is everything besides the elements
    r.done = 0;
    return r;
  }

  // cannot decide yet
  return r;
}

export function aInB<T>(b: ISetLike<T>, r: CommonInfo) {
  if (r.bIsSet || !r.aIsSet) {
    return false;
  }
  return Array.from((b as ISetCombination<T>).sets)
    .map(r.toKey)
    .includes(r.aKey);
}

export function bInA<T>(a: ISetLike<T>, r: CommonInfo) {
  if (!r.bIsSet || r.aIsSet) {
    return false;
  }
  return Array.from((a as ISetCombination<T>).sets)
    .map(r.toKey)
    .includes(r.bKey);
}

export function keyedCombinations<T>(combinations: ISetCombinations<T>, toKey = toDefaultKey) {
  return combinations.map((c) => {
    const s = Array.from(c.sets).map(toKey).sort();
    return {
      key: s.join('&'),
      s,
      sets: new Set(s),
      degree: c.degree,
      cardinality: c.cardinality,
    };
  });
}

export function combinedKey<T>(a: ISetLike<T>, b: ISetLike<T>, r: CommonInfo) {
  const sets = new Set<string>();
  if (r.aIsSet) {
    sets.add(r.aKey);
  } else {
    for (const s of Array.from((a as ISetCombination<T>).sets)) {
      sets.add(r.toKey(s));
    }
  }
  if (r.bIsSet) {
    sets.add(r.bKey);
  } else {
    for (const s of Array.from((b as ISetCombination<T>).sets)) {
      sets.add(r.toKey(s));
    }
  }
  return Array.from(sets).sort().join('&');
}

export function generateDistinctOverlapFunction<T>(
  combinations: ISetCombinations<T>,
  fallback: ISetOverlapFunction<T>,
  toKey: (s: ISetLike<T>) => string = toDefaultKey
): ISetOverlapFunction<T> {
  const combinationsBySet = new Map<string, { cardinality: number; sets: Set<string> }[]>();
  for (const c of keyedCombinations(combinations, toKey)) {
    for (const s of c.s) {
      if (combinationsBySet.has(s)) {
        combinationsBySet.get(s)!.push(c);
      } else {
        combinationsBySet.set(s, [c]);
      }
    }
  }

  return (a: ISetLike<T>, b: ISetLike<T>) => {
    const r = common(a, b, toKey);
    if (r.done != null) {
      return r.done;
    }
    if (!r.aIsSet && !r.bIsSet) {
      // by definition combinations are distinct thus if not a set in involved they overlap is 0
      return 0;
    }
    if (r.aIsSet && !r.bIsSet) {
      // if a is a set and a subset -> subset else no overlap since distinct
      return aInB(b, r) ? b.cardinality : 0;
    }
    if (!r.aIsSet && r.bIsSet) {
      // if a is a set and a subset -> subset else no overlap since distinct
      return bInA(a, r) ? a.cardinality : 0;
    }
    // both are sets solution are all combinations which have both in their key
    // e.g. A&B = A&B + A&B&C
    const hasA = combinationsBySet.get(r.aKey);
    const hasB = combinationsBySet.get(r.bKey);
    if (!hasA || !hasB) {
      return fallback(a, b);
    }
    if (hasA.length < hasB.length) {
      return hasA.reduce((acc, c) => acc + (c.sets.has(r.bKey) ? c.cardinality : 0), 0);
    }
    return hasB.reduce((acc, c) => acc + (c.sets.has(r.aKey) ? c.cardinality : 0), 0);
  };
}

export function generateIntersectionOverlapFunction<T>(
  combinations: ISetCombinations<T>,
  fallback: ISetOverlapFunction<T>,
  toKey: (s: ISetLike<T>) => string = toDefaultKey
): ISetOverlapFunction<T> {
  const combinationsByKey = new Map(keyedCombinations(combinations, toKey).map((d) => [d.key, d.cardinality]));

  return (a: ISetLike<T>, b: ISetLike<T>) => {
    const r = common(a, b, toKey);
    if (r.done != null) {
      return r.done;
    }
    if (r.aIsSet && !r.bIsSet && aInB(b, r)) {
      // own subset thus all of the intersection
      return b.cardinality;
    }
    if (!r.aIsSet && r.bIsSet && bInA(a, r)) {
      // own subset thus all of the intersection
      return a.cardinality;
    }
    const key = combinedKey(a, b, r);
    if (!combinationsByKey.has(key)) {
      return fallback(a, b);
    }
    // get A&B
    return combinationsByKey.get(key)!;
  };
}

export function generateUnionOverlapFunction<T>(
  combinations: ISetCombinations<T>,
  fallback: ISetOverlapFunction<T>,
  toKey: (s: ISetLike<T>) => string = toDefaultKey
): ISetOverlapFunction<T> {
  const combinationsByKey = new Map(keyedCombinations(combinations, toKey).map((d) => [d.key, d.cardinality]));

  return (a: ISetLike<T>, b: ISetLike<T>) => {
    const r = common(a, b, toKey);
    if (r.done != null) {
      return r.done;
    }
    if (r.aIsSet && !r.bIsSet && aInB(b, r)) {
      // own subset thus all of the main set, since with union it can just grow
      return a.cardinality;
    }
    if (!r.aIsSet && r.bIsSet && bInA(a, r)) {
      // own subset thus all of the main set, since with union it can just grow
      return b.cardinality;
    }
    const key = combinedKey(a, b, r);
    if (!combinationsByKey.has(key)) {
      return fallback(a, b);
    }
    //A&B = A+B - AUB
    return a.cardinality + b.cardinality - combinationsByKey.get(key)!;
  };
}

export function generateOverlapFunction<T>(
  combinations: ISetCombinations<T>,
  fallback: ISetOverlapFunction<T>,
  toKey: (s: ISetLike<T>) => string = toDefaultKey
): ISetOverlapFunction<T> {
  if (combinations.length === 0) {
    return fallback;
  }
  const firstType = combinations[0].type;
  if (combinations.some((s) => s.type !== firstType)) {
    // cannot compute a guess since mixed types
    return fallback;
  }
  switch (firstType) {
    case 'union':
      return generateUnionOverlapFunction(combinations, fallback, toKey);
    case 'intersection':
      return generateIntersectionOverlapFunction(combinations, fallback, toKey);
    case 'distinctIntersection':
      return generateDistinctOverlapFunction(combinations, fallback, toKey);
  }
  return fallback;
}
