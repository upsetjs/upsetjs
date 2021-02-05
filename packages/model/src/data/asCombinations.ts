/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ISetCombination, SetCombinationType, ISets } from '../model';
import { byCardinality, byComposite, byDegree, byGroup, byName, negate } from './utils';
import type { SortSetOrder } from './asSets';

/**
 * helper method to extract the sets in a set combination from its name, e.g. S1&S2 => S1,S2
 * @param sets the list of possible sets
 * @param symbol the regex to split a name
 */
export function fromSetName<T>(sets: ISets<T>, symbol = /[∩∪&|]/) {
  const byName = new Map(sets.map((s) => [s.name, s]));
  return (s: { name: string }) => {
    return s.name.split(symbol).map((setName) => byName.get(setName.trim())!);
  };
}

/**
 * sort orders for set combinations
 */
export type SortCombinationOrder =
  | SortSetOrder
  | 'group'
  | 'degree'
  | 'group:asc'
  | 'group:desc'
  | 'degree:asc'
  | 'degree:desc';

export type SortCombinationOrders = readonly SortCombinationOrder[];

export interface PostprocessCombinationsOptions {
  /**
   * order the sets combinations by the given criteria
   */
  order?: SortCombinationOrder | SortCombinationOrders;
  /**
   * limit to the top N after sorting
   */
  limit?: number;
}

function toOrder<T, S extends ISetCombination<T>>(
  sets: ISets<T>,
  order?: SortCombinationOrder | SortCombinationOrders
): (a: S, b: S) => number {
  if (!order) {
    return byName;
  }
  const arr = (Array.isArray(order) ? order : [order]) as SortCombinationOrders;
  if (arr.length === 0) {
    return byName;
  }
  return byComposite<S>(
    arr.map((o) => {
      switch (o) {
        case 'cardinality':
        case 'cardinality:desc':
          return byCardinality;
        case 'cardinality:asc':
          return negate(byCardinality);
        case 'name:desc':
          return negate(byName);
        case 'degree':
        case 'degree:asc':
          return byDegree;
        case 'degree:desc':
          return negate(byDegree);
        case 'group':
        case 'group:asc':
          return byGroup(sets);
        case 'group:desc':
          return negate(byGroup(sets));
        default:
          return byName;
      }
    })
  );
}

/**
 * @internal
 */
export function postprocessCombinations<T, S extends ISetCombination<T>>(
  sets: ISets<T>,
  combinations: S[],
  options: PostprocessCombinationsOptions = {}
) {
  let r = combinations as S[];
  if (options.order) {
    r = r.sort(toOrder(sets, options.order));
  }
  if (options.limit != null) {
    return r.slice(0, options.limit);
  }
  return r;
}

/**
 * helper to create a proper data structures for UpSet.js sets by adding extra properties
 * @param sets set like structures
 */
export function asCombination<T, S extends { name: string; elems: readonly T[] }>(
  set: S,
  type: SetCombinationType,
  toSets: (s: S) => ISets<T>
): S & ISetCombination<T> {
  const sets = toSets(set);
  return Object.assign(
    {
      type,
      cardinality: set.elems.length,
      sets: new Set(sets),
      degree: sets.length,
    },
    set
  );
}

/**
 * helper to create a proper data structures for UpSet.js sets by adding extra properties
 * @param sets set like structures
 * @param type hint for the type of combinations
 * @param toSets resolver of the contained sets
 */
export default function asCombinations<T, S extends { name: string; elems: readonly T[] }>(
  sets: readonly S[],
  type: SetCombinationType,
  toSets: (s: S) => ISets<T>
): (S & ISetCombination<T>)[] {
  return sets.map((set) => asCombination(set, type, toSets));
}
