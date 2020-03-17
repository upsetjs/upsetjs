import { ISets, ISetIntersection } from './model';
import powerSet from './powerSet';
import { PostprocessCombinationsOptions, postprocessCombinations } from './asCombinations';

export declare type GenerateSetIntersectionsOptions = PostprocessCombinationsOptions & {
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

export default function generateIntersections<T>(
  sets: ISets<T>,
  { min = 0, max = Infinity, empty = false, ...postprocess }: GenerateSetIntersectionsOptions = {}
): ReadonlyArray<ISetIntersection<T>> {
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

  const intersections: ISetIntersection<T>[] = [];

  powerSet(sets, { min, max }).forEach(intersection => {
    const elems = computeIntersection(intersection);
    if (!empty && elems.length === 0) {
      return;
    }
    intersections.push({
      type: 'intersection',
      elems: elems,
      sets: new Set(intersection),
      name: intersection.length === 1 ? intersection[0].name : `(${intersection.map(d => d.name).join(' ∩ ')})`,
      cardinality: elems.length,
      degree: intersection.length,
    });
  });

  return postprocessCombinations(sets, intersections, postprocess);
}
