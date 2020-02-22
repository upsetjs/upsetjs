import C from 'js-combinatorics';

export interface ISet<T> {
  readonly name: string;
  readonly primary: boolean;

  readonly elems: ReadonlyArray<T>;
  readonly sets: ReadonlySet<ISet<T>>;

  readonly cardinality: number;
  readonly degree: number;
}

export declare type ISets<T> = ReadonlyArray<ISet<T>>;

export function extractSets<T extends { sets: string[] }>(elements: ReadonlyArray<T>): ISets<T> {
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
      primary: true,
      elems,
      sets: s,
      name: set.toString(),
      cardinality: elems.length,
      degree: 1,
    };
    s.add(r); // itself
    return r;
  });
}

export function generateSetIntersections<T>(sets: ISets<T>, { min = 0, max = Infinity, empty = false } = {}): ISets<T> {
  const setElems = new Map(sets.map(s => [s, new Set(s.elems)]));

  function computeIntersection(intersection: ISet<T>[]) {
    if (intersection.length === 0) {
      return [];
    }
    if (intersection.length === 1) {
      return intersection[0].elems;
    }
    const smallest = intersection.reduce(
      (acc, d) => (!acc || acc.length > d.elems.length ? d.elems : acc),
      null as ReadonlyArray<T> | null
    )!;
    return smallest.filter(elem => intersection.every(s => setElems.get(s)!.has(elem)));
  }
  let i = 0;
  const intersections = C.power(sets as ISet<T>[])
    .filter(d => d.length >= min && d.length <= max)
    .map(intersection => {
      const elems = computeIntersection(intersection);
      return {
        index: i++,
        primary: false,
        elems: elems,
        sets: new Set(intersection),
        name: intersection.map(d => d.name).join(' ∩ '),
        cardinality: elems.length,
        degree: intersection.length,
      };
    });

  return empty ? intersections : intersections.filter(d => d.elems.length > 0);
}

export function asSets<T, S extends { name: string; elems: ReadonlyArray<T> }>(
  sets: ReadonlyArray<S>
): (S & ISet<T>)[] {
  return sets.map(set => {
    const s = new Set<ISet<T>>();
    const r: S & ISet<T> = {
      ...set,
      primary: true,
      sets: s,
      cardinality: set.elems.length,
      degree: 1,
    };
    s.add(r); // itself
    return r;
  });
}
