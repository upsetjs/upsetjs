import { ISets, ISetUnion } from '../model';
import powerSet from './powerSet';
import { PostprocessCombinationsOptions, postprocessCombinations } from './asCombinations';

export declare type GenerateSetUnionsOptions<T = any> = PostprocessCombinationsOptions & {
  /**
   * minimum number of union sets
   * @default 2
   */
  min?: number;
  /**
   * maximum number of union sets
   * @default Infinity
   */
  max?: number;
  /**
   * include empty intersections
   * @default false
   */
  empty?: boolean;

  /**
   * list of all elements used to compute the elements which aren't part of any given set
   */
  elems?: ReadonlyArray<T>;
};

export default function generateUnions<T>(
  sets: ISets<T>,
  { min = 2, max = Infinity, empty = false, elems: allElements = [], ...postprocess }: GenerateSetUnionsOptions<T> = {}
): ReadonlyArray<ISetUnion<T>> {
  function computeUnion(union: ISets<T>) {
    if (union.length === 0) {
      const lookup = new Set<T>();
      sets.forEach((set) => {
        set.elems.forEach((e) => lookup.add(e));
      });
      return allElements.filter((e) => !lookup.has(e));
    }
    if (union.length === 1) {
      return union[0].elems;
    }
    const largest = union.reduce(
      (acc, d) => (!acc || acc.length < d.elems.length ? d.elems : acc),
      null as ReadonlyArray<T> | null
    )!;

    const all: T[] = largest.slice();
    const contained = new Set(all);

    union.forEach((set) => {
      if (set.elems === largest) {
        // already included
        return;
      }
      set.elems.forEach((elem) => {
        if (!contained.has(elem)) {
          all.push(elem);
          contained.add(elem);
        }
      });
    });

    return all;
  }

  const unions: ISetUnion<T>[] = [];

  powerSet(sets, { min, max }).forEach((union) => {
    const elems = computeUnion(union);
    if (!empty && elems.length === 0) {
      return;
    }
    unions.push({
      type: 'union',
      elems,
      sets: new Set(union),
      name: union.length === 1 ? union[0].name : `(${union.map((d) => d.name).join(' ∪ ')})`,
      cardinality: elems.length,
      degree: union.length,
    });
  });

  return postprocessCombinations(sets, unions, postprocess);
}
