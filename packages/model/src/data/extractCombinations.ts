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
import generateCombinations from './generateCombinations';

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

type IWriteAbleSetCombination<T> = ISetCombination<T> & {
  readonly elems: T[];
  cardinality: number;
};

function createTree<T>(
  byDegree: IWriteAbleSetCombination<T>[][],
  getOrCreateCombination: (sets: string[]) => IWriteAbleSetCombination<T>
) {
  const children = new Map<IWriteAbleSetCombination<T>, IWriteAbleSetCombination<T>[]>();
  // create a tree of set intersections
  for (const csOfDegree of byDegree.slice().reverse()) {
    if (csOfDegree.length === 0 || csOfDegree[0].degree === 1) {
      continue;
    }
    // compute parents by leaving one out
    for (const c of csOfDegree) {
      const sets = Array.from(c.sets).map((d) => d.name);
      for (let i = 0; i < sets.length; i++) {
        const subSet = sets.slice();
        subSet.splice(i, 1);
        const parent = getOrCreateCombination(subSet);
        if (children.has(parent)) {
          children.get(parent)!.push(c);
        } else {
          children.set(parent, [c]);
        }
      }
    }
  }
  return children;
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
  // O(N)
  const sets = extractSets(elements, acc, {
    limit: options.setLimit,
    order: options.setOrder,
  });

  if (type === 'union') {
    // TODO find more optimized way
    return {
      sets,
      combinations: generateCombinations(sets, {
        type: 'union',
        limit: options.combinationLimit,
        order: options.combinationOrder,
      }),
    };
  }

  const setLookup = new Map<string, [ISet<T>, number]>(sets.map((d, i) => [d.name, [d, i]]));
  const bySet = (a: string, b: string) => {
    const ai = setLookup.get(a)?.[1] ?? -1;
    const bi = setLookup.get(b)?.[1] ?? -1;
    return ai - bi;
  };
  const validSet = new Set(sets.map((d) => d.name));
  const joiner = options.joiner ?? SET_JOINERS[type];
  const cs: ISetCombination<T>[] = [];
  const csLookup = new Map<string, IWriteAbleSetCombination<T>>();
  const byDegree: IWriteAbleSetCombination<T>[][] = Array(sets.length + 1)
    .fill(0)
    .map((_) => []);

  function getOrCreateCombination(setsOfElem: string[]) {
    const name = setsOfElem.length === 1 ? setsOfElem[0] : `(${setsOfElem.sort(bySet).join(joiner)})`;
    let entry = csLookup.get(name);
    if (entry) {
      return entry;
    }
    const newEntry: IWriteAbleSetCombination<T> = {
      type,
      name,
      degree: setsOfElem.length,
      sets: new Set(setsOfElem.map((s) => setLookup.get(s)![0])),
      cardinality: 0,
      elems: [],
    };
    csLookup.set(name, newEntry);
    cs.push(newEntry);
    byDegree[newEntry.degree]!.push(newEntry);
    return newEntry;
  }

  // O(N)
  for (const elem of elements) {
    const setsOfElem = acc(elem).filter((d) => validSet.has(d));
    const c = getOrCreateCombination(setsOfElem);
    c.elems.push(elem);
    (c as { cardinality: number }).cardinality++;
  }

  const finalize = () => {
    return {
      sets,
      combinations: postprocessCombinations(sets, cs, {
        order: options.combinationOrder,
        limit: options.combinationLimit,
      }),
    };
  };

  if (type === 'distinctIntersection') {
    // no need to aggregate
    return finalize();
  }

  // O(N*log(N))
  const children = createTree(byDegree, getOrCreateCombination);

  function visit(node: IWriteAbleSetCombination<T>, visited: Set<IWriteAbleSetCombination<T>>, agg: T[][]) {
    if (visited.has(node)) {
      return;
    }
    visited.add(node);
    agg.push(node.elems);
    for (const child of children.get(node) ?? []) {
      visit(child, visited, agg);
    }
  }

  for (const level of byDegree.slice(1)) {
    // aggregate all children into a node by level
    // A = A + A&B + A&C + A&B&C
    // A&B = A&B + A&B&C
    for (const node of level) {
      const visited = new Set<IWriteAbleSetCombination<T>>();
      const agg: T[][] = [node.elems];
      for (const child of children.get(node) ?? []) {
        visit(child, visited, agg);
      }
      const elems = agg.flat();
      Object.assign(node, { elems, cardinality: elems.length });
    }
  }

  return finalize();
}
