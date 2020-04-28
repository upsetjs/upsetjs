/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISet, ISetCombination } from '../model';
import { byCardinality, byComposite, byDegree, byGroup, byName } from './utils';

export function fromSetName<T>(sets: ReadonlyArray<ISet<T>>, symbol = /[∩∪&|]/) {
  const byName = new Map(sets.map((s) => [s.name, s]));
  return (s: { name: string }) => {
    return s.name.split(symbol).map((setName) => byName.get(setName.trim())!);
  };
}

export declare type PostprocessCombinationsOptions = {
  order?: 'group' | 'cardinality' | 'name' | 'degree' | ReadonlyArray<'group' | 'cardinality' | 'name' | 'degree'>;
  limit?: number;
};

/**
 * @internal
 */
export function postprocessCombinations<T, S extends ISetCombination<T>>(
  sets: ReadonlyArray<ISet<T>>,
  combinations: S[],
  options: PostprocessCombinationsOptions = {}
) {
  let r = combinations as S[];
  if (options.order) {
    const order: ReadonlyArray<'group' | 'cardinality' | 'name' | 'degree'> = Array.isArray(options.order)
      ? options.order
      : [options.order];
    const lookup = {
      cardinality: byCardinality,
      name: byName,
      degree: byDegree,
      group: byGroup(sets) as any,
    };
    const sorter = byComposite(order.map((v) => lookup[v]));
    r = r.sort(sorter);
  }
  if (options.limit != null) {
    return r.slice(0, options.limit);
  }
  return r;
}

/**
 * helper to create a proper data structures for UpSet sets
 * @param sets set like structures
 */
export function asCombination<T, S extends { name: string; elems: ReadonlyArray<T> }>(
  set: S,
  type: 'intersection' | 'union' | 'composite',
  toSets: (s: S) => ReadonlyArray<ISet<T>>
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
 * helper to create a proper data structures for UpSet sets
 * @param sets set like structures
 */
export default function asCombinations<T, S extends { name: string; elems: ReadonlyArray<T> }>(
  sets: ReadonlyArray<S>,
  type: 'intersection' | 'union' | 'composite',
  toSets: (s: S) => ReadonlyArray<ISet<T>>
): (S & ISetCombination<T>)[] {
  return sets.map((set) => asCombination(set, type, toSets));
}
