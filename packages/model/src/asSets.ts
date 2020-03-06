import type { ISet } from './model';

/**
 * helper to create a proper data structures for UpSet sets
 * @param sets set like structures
 */
export default function asSets<T, S extends { name: string; elems: ReadonlyArray<T> }>(
  sets: ReadonlyArray<S>
): (S & ISet<T>)[] {
  return sets.map(set => {
    const r: S & ISet<T> = {
      ...set,
      type: 'set',
      cardinality: set.elems.length,
    };
    return r;
  });
}
