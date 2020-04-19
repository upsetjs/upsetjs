import { ISetCombination, ISetCombinations, ISets } from '../model';
import { isSetLike } from '../validators';
import { postprocessCombinations, PostprocessCombinationsOptions } from './asCombinations';
import powerSet from './powerSet';

export declare type GenerateSetCombinationsOptions<T = any> = {
  type: 'intersection' | 'union';
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

  /**
   * list of all elements used to compute the elements which aren't part of any given set
   * or the number of elements that are not part of any set
   */
  elems?: ReadonlyArray<T>;

  notPartOfAnySet?: ReadonlyArray<T> | number;
} & PostprocessCombinationsOptions;

function intersectionBuilder<T>(
  sets: ISets<T>,
  allElements: ReadonlyArray<T>,
  notPartOfAnySet?: ReadonlyArray<T> | number
) {
  const setElems = new Map(sets.map((s) => [s, new Set(s.elems)]));

  function computeIntersection(intersection: ISets<T>) {
    if (intersection.length === 0) {
      if (Array.isArray(notPartOfAnySet)) {
        return notPartOfAnySet;
      }
      const lookup = Array.from(setElems.values());
      return allElements.filter((e) => lookup.every((s) => !s.has(e)));
    }
    if (intersection.length === 1) {
      return intersection[0].elems;
    }
    const smallest = intersection.reduce(
      (acc, d) => (!acc || acc.length > d.elems.length ? d.elems : acc),
      null as ReadonlyArray<T> | null
    )!;
    return smallest.filter((elem) => intersection.every((s) => setElems.get(s)!.has(elem)));
  }
  return computeIntersection;
}

function unionBuilder<T>(sets: ISets<T>, allElements: ReadonlyArray<T>, notPartOfAnySet?: ReadonlyArray<T> | number) {
  function computeUnion(union: ISets<T>) {
    if (union.length === 0) {
      if (Array.isArray(notPartOfAnySet)) {
        return notPartOfAnySet;
      }
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
  return computeUnion;
}

export default function generateCombinations<T = any>(
  sets: ISets<T>,
  {
    type,
    min = 0,
    max = Infinity,
    empty = false,
    elems: allElements = [],
    notPartOfAnySet,
    ...postprocess
  }: GenerateSetCombinationsOptions<T> = { type: 'intersection' }
): ISetCombinations<T> {
  const joiner = type === 'intersection' ? ' ∩ ' : ' ∪ ';
  const combinations: ISetCombination<T>[] = [];

  const compute = (type === 'intersection' ? intersectionBuilder : unionBuilder)(sets, allElements, notPartOfAnySet);

  powerSet(sets, { min, max }).forEach((combo) => {
    if (combo.length === 0 && typeof notPartOfAnySet === 'number' && notPartOfAnySet > 0) {
      combinations.push({
        type: 'composite',
        elems: [],
        sets: new Set(),
        name: `()`,
        cardinality: notPartOfAnySet,
        overlap(s) {
          return s === this || (isSetLike(s) && s.name === this.name && s.cardinality === this.cardinality)
            ? this.cardinality
            : 0;
        },
        degree: 0,
      });
      return;
    }
    const elems = compute(combo);
    if (!empty && elems.length === 0) {
      return;
    }
    combinations.push({
      type: combo.length === 0 ? 'composite' : type,
      elems,
      sets: new Set(combo),
      name: combo.length === 1 ? combo[0].name : `(${combo.map((d) => d.name).join(joiner)})`,
      cardinality: elems.length,
      degree: combo.length,
    });
  });

  return postprocessCombinations(sets, combinations, postprocess);
}
