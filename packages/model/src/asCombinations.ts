import type { ISet, ISetCombination } from './model';


export function fromSetName<T>(sets: ReadonlyArray<ISet<T>>, symbol = / [∩∪] /) {
  const byName = new Map(sets.map((s) => [s.name, s]));
  return (s: { name: string }) => {
    return s.name.split(symbol).map((setName) => byName.get(setName)!);
  };
}

/**
 * helper to create a proper data structures for UpSet sets
 * @param sets set like structures
 */
export function asCombination<T, S extends { name: string; elems: ReadonlyArray<T> }>(
  set: S, type: 'intersection' | 'union', toSets: (s: S) => ReadonlyArray<ISet<T>>
): (S & ISetCombination<T>) {
  const sets = toSets(set);
  const r: S & ISetCombination<T> = {
    type,
    cardinality: set.elems.length,
    sets: new Set(sets),
    degree: sets.length,
    ...set,
  };
  return r;
}


/**
 * helper to create a proper data structures for UpSet sets
 * @param sets set like structures
 */
export default function asCombinations<T, S extends { name: string; elems: ReadonlyArray<T> }>(
  sets: ReadonlyArray<S>, type: 'intersection' | 'union', toSets: (s: S) => ReadonlyArray<ISet<T>>
): (S & ISetCombination<T>)[] {
  return sets.map(set => {
    const sets = toSets(set);
    const r: S & ISetCombination<T> = {
      type,
      cardinality: set.elems.length,
      sets: new Set(sets),
      degree: sets.length,
      ...set,
    };
    return r;
  });
}
