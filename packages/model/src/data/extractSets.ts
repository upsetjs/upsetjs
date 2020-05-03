/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISets, ISet } from '../model';

/**
 * extract sets out of a given element array, where an accessor is used to specify the set names
 * @param elements list of elements
 * @param acc accessor to get the list of sets the element belong to
 */
export default function extractSets<T>(elements: ReadonlyArray<T>, acc: (elem: T) => string[]): ISets<T>;
/**
 * extract sets out of a given element array which have a `.sets` property
 * @param elements
 */
export default function extractSets<T extends { sets: string[] }>(elements: ReadonlyArray<T>): ISets<T>;

export default function extractSets<T>(
  elements: ReadonlyArray<T>,
  acc = (e: T) => ((e as unknown) as { sets: string[] }).sets
): ISets<T> {
  const sets = new Map<string, T[]>();

  elements.forEach((elem) => {
    acc(elem).forEach((set) => {
      if (!sets.has(set)) {
        sets.set(set, [elem]);
      } else {
        sets.get(set)!.push(elem);
      }
    });
  });
  return Array.from(sets).map(([set, elems]) => {
    const r: ISet<T> = {
      type: 'set',
      elems,
      name: set.toString(),
      cardinality: elems.length,
    };
    return r;
  });
}
