/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ISet, ISetCombination, ISetCombinations, ISetLike, ISets, SetCombinationType } from '../model';
import { postprocessCombinations, SortCombinationOrder, SortCombinationOrders } from './asCombinations';
import type { SortSetOrder } from './asSets';
import { SET_JOINERS } from './constants';
import extractSets from './extractSets';

export interface ExtractCombinationsOptions {
  type?: SetCombinationType;

  setOrder?: SortSetOrder;
  setLimit?: number;

  combinationOrder?: SortCombinationOrder | SortCombinationOrders;
  combinationLimit?: number;

  joiner?: string;

  /**
   * optional function to identify the same sets
   * @param set the set to generate a key for
   */
  toKey?: (set: ISetLike<unknown>) => string;
}
/**
 * extract sets out of a given element array, where an accessor is used to specify the set names
 * @param elements list of elements
 * @param acc accessor to get the list of sets the element belong to
 * @param options postprocess options
 */
export default function extractCombinations<T>(
  elements: readonly T[],
  acc: (elem: T) => string[],
  options?: ExtractCombinationsOptions
): { sets: ISets<T>; combinations: ISetCombinations<T> };
/**
 * extract sets out of a given element array which have a `.sets` property
 * @param elements
 * @param options postprocess options
 */
// eslint-disable-next-line no-redeclare
export default function extractCombinations<T extends { sets: string[] }>(
  elements: readonly T[],
  options?: ExtractCombinationsOptions
): { sets: ISets<T>; combinations: ISetCombinations<T> };

// eslint-disable-next-line no-redeclare
export default function extractCombinations<T>(
  elements: readonly T[],
  accOrOptions?: ExtractCombinationsOptions | ((elem: T) => string[]),
  o: ExtractCombinationsOptions = {}
): { sets: ISets<T>; combinations: ISetCombinations<T> } {
  const acc = typeof accOrOptions === 'function' ? accOrOptions : (e: T) => ((e as unknown) as { sets: string[] }).sets;
  const options: ExtractCombinationsOptions = (typeof accOrOptions !== 'function' ? accOrOptions : o) ?? {};

  const type = options.type ?? 'intersection';

  // extract all sets
  const sets = extractSets(elements, acc, {
    limit: options.setLimit,
    order: options.setOrder,
  });

  const setLookup = new Map<string, [ISet<T>, number]>(sets.map((d, i) => [d.name, [d, i]]));
  const bySet = (a: string, b: string) => {
    const ai = setLookup.get(a)?.[1] ?? -1;
    const bi = setLookup.get(b)?.[1] ?? -1;
    return ai - bi;
  };
  const validSet = new Set(sets.map((d) => d.name));
  const joiner = options.joiner ?? SET_JOINERS[type];
  const cs: ISetCombination<T>[] = [];
  const csLookup = new Map<string, ISetCombination<T>>();

  function getOrCreateCombination(
    setsOfElem: string[]
  ): ISetCombination<T> & { readonly elems: T[]; cardinality: number } {
    const key = setsOfElem.join(joiner);
    let entry = csLookup.get(key) as ISetCombination<T> & { readonly elems: T[]; cardinality: number };
    if (!entry) {
      entry = {
        type,
        name: key,
        degree: setsOfElem.length,
        sets: new Set(setsOfElem.map((s) => setLookup.get(s)![0])),
        cardinality: 0,
        elems: [],
      };
      csLookup.set(key, entry);
      cs.push(entry);
    }
    return entry;
  }

  for (const elem of elements) {
    const setsOfElem = acc(elem)
      .filter((d) => validSet.has(d))
      .sort(bySet);
    const c = getOrCreateCombination(setsOfElem);
    c.elems.push(elem);
    (c as { cardinality: number }).cardinality++;

    if (type === 'distinctIntersection') {
      continue;
    }
    //
    // TODO handle union and intersection
  }
  const sortedCombinations = postprocessCombinations(sets, cs, {
    order: options.combinationOrder,
    limit: options.combinationLimit,
  });

  return {
    sets,
    combinations: sortedCombinations,
  };
}
