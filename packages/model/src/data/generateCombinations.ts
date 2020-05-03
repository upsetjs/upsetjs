/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetCombination, ISetCombinations, ISets, ISet } from '../model';
import { isSetLike } from '../validators';
import { postprocessCombinations, PostprocessCombinationsOptions } from './asCombinations';
import powerSet from './powerSet';
import { SET_JOINERS } from './constants';

export declare type GenerateSetCombinationsOptions<T = any> = {
  /**
   * type of set combination
   * @default intersection
   */
  type?: 'intersection' | 'union';
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
   */
  elems?: ReadonlyArray<T>;
  /**
   * alternative to `.elems` by directly specifying the elements that are not part of any set
   * just makes sense with min=0
   */
  notPartOfAnySet?: ReadonlyArray<T> | number;
  /**
   * optional elem key function
   * @param v
   */
  toElemKey?(v: T): string;
} & PostprocessCombinationsOptions;

function intersectionBuilder<T>(
  sets: ISets<T>,
  allElements: ReadonlyArray<T>,
  notPartOfAnySet?: ReadonlyArray<T> | number,
  toElemKey?: (v: T) => string
) {
  const setElems = new Map(sets.map((s) => [s, toElemKey ? new Set(s.elems.map(toElemKey!)) : new Set(s.elems)]));
  const setDirectElems = toElemKey ? null : (setElems as Map<ISet<T>, Set<T>>);
  const setKeyElems = toElemKey ? (setElems as Map<ISet<T>, Set<string>>) : null;

  function computeIntersection(intersection: ISets<T>) {
    if (intersection.length === 0) {
      if (Array.isArray(notPartOfAnySet)) {
        return notPartOfAnySet;
      }
      if (setKeyElems && toElemKey) {
        const lookup = Array.from(setKeyElems.values());
        return allElements.filter((e) => {
          const k = toElemKey(e);
          return lookup.every((s) => !s.has(k));
        });
      }
      const lookup = Array.from(setDirectElems!.values());
      return allElements.filter((e) => lookup.every((s) => !s.has(e)));
    }
    if (intersection.length === 1) {
      return intersection[0].elems;
    }
    const smallest = intersection.reduce(
      (acc, d) => (!acc || acc.length > d.elems.length ? d.elems : acc),
      null as ReadonlyArray<T> | null
    )!;
    if (setKeyElems && toElemKey) {
      return smallest.filter((elem) => {
        const key = toElemKey(elem);
        return intersection.every((s) => setKeyElems.get(s)!.has(key));
      });
    }
    return smallest.filter((elem) => intersection.every((s) => setDirectElems!.get(s)!.has(elem)));
  }
  return computeIntersection;
}

function unionBuilder<T>(
  sets: ISets<T>,
  allElements: ReadonlyArray<T>,
  notPartOfAnySet?: ReadonlyArray<T> | number,
  toElemKey?: (v: T) => string
) {
  function computeUnion(union: ISets<T>) {
    if (union.length === 0) {
      if (Array.isArray(notPartOfAnySet)) {
        return notPartOfAnySet;
      }
      if (toElemKey) {
        const lookup = new Set<string>();
        sets.forEach((set) => {
          set.elems.forEach((e) => lookup.add(toElemKey(e)));
        });
        return allElements.filter((e) => !lookup.has(toElemKey(e)));
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
    const contained = toElemKey ? new Set(all.map(toElemKey)) : new Set(all);

    union.forEach((set) => {
      if (set.elems === largest) {
        // already included
        return;
      }
      set.elems.forEach((elem) => {
        if (toElemKey) {
          const key = toElemKey(elem);
          if (!(contained as Set<string>).has(key)) {
            all.push(elem);
            (contained as Set<string>).add(key);
          }
        } else if (!(contained as Set<T>).has(elem)) {
          all.push(elem);
          (contained as Set<T>).add(elem);
        }
      });
    });

    return all;
  }
  return computeUnion;
}

/**
 * generate set intersection/unions for a given list of sets
 * @param sets the sets with their elements
 * @param options additional customization options
 */
export default function generateCombinations<T = any>(
  sets: ISets<T>,
  {
    type = 'intersection',
    min = 0,
    max = Infinity,
    empty = false,
    elems: allElements = [],
    notPartOfAnySet,
    toElemKey,
    ...postprocess
  }: GenerateSetCombinationsOptions<T> = {}
): ISetCombinations<T> {
  const joiner = SET_JOINERS[type] ?? SET_JOINERS.intersection;
  const combinations: ISetCombination<T>[] = [];

  const compute = (type === 'union' ? unionBuilder : intersectionBuilder)(
    sets,
    allElements,
    notPartOfAnySet,
    toElemKey
  );

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
