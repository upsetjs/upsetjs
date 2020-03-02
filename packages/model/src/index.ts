import powerSet from './powerSet';

/**
 * represents an internal set
 */
export interface ISetBase<T> {
  /**
   * name of the set
   */
  readonly name: string;
  /**
   * elements in this set
   */
  readonly elems: ReadonlyArray<T>;

  readonly cardinality: number;
}
export interface ISet<T> extends ISetBase<T> {
  readonly type: 'set';
}

export interface IIntersectionSet<T> extends ISetBase<T> {
  /**
   * whether it is a set or an intersection
   */
  readonly type: 'intersection';
  /**
   * sets this
   */
  readonly sets: ReadonlySet<ISet<T>>;
  readonly degree: number;
}

export declare type ISets<T> = ReadonlyArray<ISet<T>>;
export declare type IIntersectionSets<T> = ReadonlyArray<IIntersectionSet<T>>;

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
      type: 'set',
      elems,
      name: set.toString(),
      cardinality: elems.length,
    };
    s.add(r); // itself
    return r;
  });
}

export declare type GenerateSetIntersectionsOptions = {
  /**
   * minimum number of intersecting sets
   * @default 0
   */
  min?: number;
  /**
   * maximum number of intersecting sets
   * @default Infinity
   */
  max?: number;
  /**
   * include empty intersections
   * @default false
   */
  empty?: boolean;
};

export function generateSetIntersections<T>(
  sets: ISets<T>,
  { min = 0, max = Infinity, empty = false }: GenerateSetIntersectionsOptions = {}
): IIntersectionSets<T> {
  const setElems = new Map(sets.map(s => [s, new Set(s.elems)]));

  function computeIntersection(intersection: ISets<T>) {
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

  const intersections: IIntersectionSet<T>[] = [];

  const it = powerSet(sets, { min, max });
  let n = it.next();
  while (!n.done) {
    const intersection = n.value;
    n = it.next();

    const elems = computeIntersection(intersection);
    if (empty && elems.length === 0) {
      continue;
    }
    intersections.push({
      type: 'intersection',
      elems: elems,
      sets: new Set(intersection),
      name: intersection.map(d => d.name).join(' ∩ '),
      cardinality: elems.length,
      degree: intersection.length,
    });
  }

  return intersections;
}

export function asSets<T, S extends { name: string; elems: ReadonlyArray<T> }>(
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
