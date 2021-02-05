/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ISet } from '../model';
import { byCardinality, byName, byComposite, negate } from './utils';

/**
 * helper method to create proper UpSet.js structures by adding extra properties
 * @param set the set to complete
 */
export function asSet<T, S extends { name: string; elems: readonly T[] }>(set: S): S & ISet<T> {
  return Object.assign(
    {
      type: 'set' as 'set',
      cardinality: set.elems.length,
    },
    set
  );
}

/**
 * possible set sort orders
 */
export type SortSetOrder = 'cardinality' | 'name' | 'cardinality:desc' | 'name:asc' | 'cardinality:asc' | 'name:desc';

export interface PostprocessSetOptions {
  /**
   * order the set by the given criteria
   */
  order?: SortSetOrder;
  /**
   * limit to the top N sets after sorting
   */
  limit?: number;
}

function toOrder<T, S extends ISet<T>>(order?: SortSetOrder): (a: S, b: S) => number {
  if (!order) {
    return byName;
  }
  switch (order) {
    case 'cardinality':
    case 'cardinality:desc':
      return byComposite<S>([byCardinality, byName]);
    case 'cardinality:asc':
      return byComposite<S>([negate(byCardinality), byName]);
    case 'name:desc':
      return negate(byName);
    default:
      return byName;
  }
}

/**
 * @internal
 */
export function postprocessSets<T, S extends ISet<T>>(sets: readonly S[], options: PostprocessSetOptions = {}) {
  let r = sets as S[];
  if (options.order) {
    const order = toOrder(options.order);
    r = r.slice().sort(order);
  }
  if (options.limit != null) {
    return r.slice(0, options.limit);
  }
  return r;
}

/**
 * helper to create a proper data structures for UpSet.js sets by adding extra properties
 * @param sets set like structures
 * @param options additional postprocessing options
 */
export default function asSets<T, S extends { name: string; elems: readonly T[] }>(
  sets: readonly S[],
  options: PostprocessSetOptions = {}
): (S & ISet<T>)[] {
  return postprocessSets(sets.map(asSet), options);
}
