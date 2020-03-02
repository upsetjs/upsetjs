import type { ISets, IIntersectionSet, IIntersectionSets } from './model';
import powerSet from './powerSet';

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

export default function generateSetIntersections<T>(
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
    if (!empty && elems.length === 0) {
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
