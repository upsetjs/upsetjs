import type { ISet } from './model';

export function asSet<T, S extends { name: string; elems: ReadonlyArray<T> }>(
  set: S
): (S & ISet<T>) {
  const r: S & ISet<T> = {
    type: 'set',
    cardinality: set.elems.length,
    ...set,
  };
  return r;
}

/**
 * helper to create a proper data structures for UpSet sets
 * @param sets set like structures
 */
export default function asSets<T, S extends { name: string; elems: ReadonlyArray<T> }>(
  sets: ReadonlyArray<S>
): (S & ISet<T>)[] {
  return sets.map(asSet);
}
