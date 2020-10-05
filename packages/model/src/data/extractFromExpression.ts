/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import {
  ISets,
  SetCombinationType,
  ISet,
  ISetCombination,
  ISetLike,
  toKey as toDefaultKey,
  ISetCombinations,
} from '../model';
import { SortSetOrder, postprocessSets } from './asSets';
import { SortCombinationOrder, SortCombinationOrders, postprocessCombinations } from './asCombinations';
import { SET_JOINERS } from './constants';
import { isSet } from '../validators';

export interface ExtractFromExpressionOptions {
  type?: SetCombinationType;

  setOrder?: SortSetOrder;

  combinationOrder?: SortCombinationOrder | SortCombinationOrders;

  joiner?: string;
  /**
   * optional function to identify the same sets
   * @param set the set to generate a key for
   */
  toKey?: (set: ISetLike<unknown>) => string;
}

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

export function generateDistinctOverlapFunction<T>(combinations: ISetCombinations<T>, toKey = toDefaultKey) {
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
      return 0;
    }
    if (hasA.length < hasB.length) {
      return hasA.reduce((acc, c) => acc + (c.sets.has(r.bKey) ? c.cardinality : 0), 0);
    }
    return hasB.reduce((acc, c) => acc + (c.sets.has(r.aKey) ? c.cardinality : 0), 0);
  };
}

export function generateIntersectionOverlapFunction<T>(combinations: ISetCombinations<T>, toKey = toDefaultKey) {
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
      return 0; // cannot compute
    }
    // get A&B
    return combinationsByKey.get(key)!;
  };
}

export function generateUnionOverlapFunction<T>(combinations: ISetCombinations<T>, toKey = toDefaultKey) {
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
      return 0; // cannot compute
    }
    //A&B = A+B - AUB
    return a.cardinality + b.cardinality - combinationsByKey.get(key)!;
  };
}

/**
 * extract sets and combinations out of a given list of static combination information.
 * In addition an accessor is used to specify the set names
 * @param combinations list of combinations
 * @param accessor accessor to get the list of sets the combination belong to
 * @param options hints about the given combinations
 */
export default function extractFromExpression<T extends { cardinality: number }>(
  combinations: readonly T[],
  accessor: (elem: T) => string[],
  options?: ExtractFromExpressionOptions
): { sets: ISets<unknown>; combinations: readonly (T & ISetCombination<unknown>)[] };
/**
 * extract sets out of a given element array which have a `.sets` property
 * @param combinations
 * @param options hints about the given combinations
 */
// eslint-disable-next-line no-redeclare
export default function extractFromExpression<T extends { sets: string[]; cardinality: number }>(
  combinations: readonly T[],
  options?: ExtractFromExpressionOptions
): { sets: ISets<unknown>; combinations: readonly (T & ISetCombination<unknown>)[] };
// eslint-disable-next-line no-redeclare
export default function extractFromExpression<T extends { cardinality: number }>(
  combinations: readonly T[],
  accOrOptions?: ExtractFromExpressionOptions | ((elem: T) => string[]),
  o: ExtractFromExpressionOptions = {}
): { sets: ISets<unknown>; combinations: readonly (T & ISetCombination<unknown>)[] } {
  const acc = typeof accOrOptions === 'function' ? accOrOptions : (e: T) => ((e as unknown) as { sets: string[] }).sets;
  const options: ExtractFromExpressionOptions = (typeof accOrOptions !== 'function' ? accOrOptions : o) ?? {};

  const type = options.type ?? 'intersection';

  const joiner = options.joiner ?? SET_JOINERS[type];

  const sets: ISet<unknown>[] = [];
  const setLookup = new Map<string, ISet<unknown>>();

  let overlapFunction: null | ((a: ISetLike<unknown>, b: ISetLike<unknown>) => number) = null;

  function overlap(this: ISetLike<unknown>, that: ISetLike<unknown>) {
    if (this === that) {
      return this.cardinality;
    }
    return overlapFunction == null ? 0 : overlapFunction(this, that);
  }

  const cs: (T & ISetCombination<unknown>)[] = combinations.map((c) => {
    const containedSets = acc(c);

    const containedSetsObjects = containedSets.map((s) => {
      if (setLookup.has(s)) {
        return setLookup.get(s)!;
      }
      const set: ISet<unknown> = {
        cardinality: 0,
        elems: [],
        name: s,
        type: 'set',
        overlap,
      };
      sets.push(set);
      setLookup.set(set.name, set);
      return set;
    });

    if (type === 'distinctIntersection') {
      // we can add the cardinality of a subset to the main set
      for (const s of containedSetsObjects) {
        (s as { cardinality: number }).cardinality += c.cardinality;
      }
    } else if (containedSets.length === 1) {
      // merge into set
      Object.assign(
        containedSetsObjects[0],
        {
          cardinality: c.cardinality,
        },
        c
      );
    } else if (type === 'intersection') {
      // we can at least ensure it is at least the intersection
      for (const s of containedSetsObjects) {
        (s as { cardinality: number }).cardinality = Math.max(s.cardinality, c.cardinality);
      }
    } else if (type === 'union') {
      // we can at least ensure it is at most the intersection
      for (const s of containedSetsObjects) {
        (s as { cardinality: number }).cardinality = Math.min(s.cardinality, c.cardinality);
      }
    }

    const name = containedSets.join(joiner);
    return Object.assign(
      {
        type,
        elems: [],
        name,
        overlap,
      },
      c,
      {
        cardinality: c.cardinality,
        degree: containedSets.length,
        sets: new Set(containedSetsObjects),
      }
    );
  });

  const sortedSets = postprocessSets(sets, {
    order: options.setOrder,
  });
  const sortedCombinations = postprocessCombinations(sortedSets, cs, {
    order: options.combinationOrder,
  });

  // no since we are done we can compute a proper overlap with the given data
  switch (type) {
    case 'distinctIntersection':
      overlapFunction = generateDistinctOverlapFunction(sortedCombinations, options.toKey);
      break;
    case 'union':
      overlapFunction = generateUnionOverlapFunction(sortedCombinations, options.toKey);
      break;
    default:
      overlapFunction = generateIntersectionOverlapFunction(sortedCombinations, options.toKey);
      break;
  }

  return {
    sets: sortedSets,
    combinations: sortedCombinations,
  };
}
