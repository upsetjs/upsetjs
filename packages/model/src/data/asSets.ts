/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISet } from '../model';
import { byCardinality, byName, byComposite, negate } from './utils';

export function asSet<T, S extends { name: string; elems: ReadonlyArray<T> }>(set: S): S & ISet<T> {
  return Object.assign(
    {
      type: 'set' as 'set',
      cardinality: set.elems.length,
    },
    set
  );
}

export declare type SortSetOrder =
  | 'cardinality'
  | 'name'
  | 'cardinality:desc'
  | 'name:asc'
  | 'cardinality:asc'
  | 'name:desc';

export declare type PostprocessSetOptions = {
  order?: SortSetOrder;
  limit?: number;
};

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
export function postprocessSets<T, S extends ISet<T>>(sets: ReadonlyArray<S>, options: PostprocessSetOptions = {}) {
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
 * helper to create a proper data structures for UpSet.js sets
 * @param sets set like structures
 */
export default function asSets<T, S extends { name: string; elems: ReadonlyArray<T> }>(
  sets: ReadonlyArray<S>,
  options: PostprocessSetOptions = {}
): (S & ISet<T>)[] {
  return postprocessSets(sets.map(asSet), options);
}
