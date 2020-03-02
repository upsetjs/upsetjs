import type {ISets, ISet} from './model';

export default function extractSets<T extends { sets: string[] }>(elements: ReadonlyArray<T>): ISets<T> {
  const sets = new Map<string, T[]>();

  elements.forEach(elem => {
    elem.sets.forEach(set => {
      if (!sets.has(set)) {
        sets.set(set, [elem]);
      } else {
        sets.get(set)!.push(elem);
      }
    });
  });
  return Array.from(sets).map(([set, elems]) => {
    const s = new Set<ISet<T>>();
    const r: ISet<T> = {
      type: 'set',
      elems,
      name: set.toString(),
      cardinality: elems.length,
    };
    s.add(r); // itself
    return r;
  });
}
