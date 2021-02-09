/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import type { ISet, ISetCombination, ISetCombinations, ISets, SetCombinationType } from '../model';
import { postprocessCombinations, SortCombinationOrder, SortCombinationOrders } from './asCombinations';
import type { SortSetOrder } from './asSets';
import { SET_JOINERS } from './constants';
import extractSets from './extractSets';
import generateCombinations from './generateCombinations';

export interface ExtractCombinationsOptions<T> {
  type?: SetCombinationType;

  setOrder?: SortSetOrder;
  setLimit?: number;

  combinationOrder?: SortCombinationOrder | SortCombinationOrders;
  combinationLimit?: number;

  sets?: ISets<T>;

  joiner?: string;
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
  byDegree
    .slice()
    .reverse()
    .forEach((csOfDegree) => {
      if (csOfDegree.length === 0 || csOfDegree[0].degree === 1) {
        return;
      }
      // compute parents by leaving one out
      csOfDegree.forEach((c) => {
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
      });
    });
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
  options?: ExtractCombinationsOptions<T>
): { sets: ISets<T>; combinations: ISetCombinations<T> };
/**
 * extract sets out of a given element array which have a `.sets` property
 * @param elements
 * @param options postprocess options
 */
// eslint-disable-next-line no-redeclare
export default function extractCombinations<T extends { sets: string[] }>(
  elements: readonly T[],
  options?: ExtractCombinationsOptions<T>
): { sets: ISets<T>; combinations: ISetCombinations<T> };

// eslint-disable-next-line no-redeclare
export default function extractCombinations<T>(
  elements: readonly T[],
  accOrOptions?: ExtractCombinationsOptions<T> | ((elem: T) => string[]),
  o: ExtractCombinationsOptions<T> = {}
): { sets: ISets<T>; combinations: ISetCombinations<T> } {
  const acc = typeof accOrOptions === 'function' ? accOrOptions : (e: T) => ((e as unknown) as { sets: string[] }).sets;
  const options: ExtractCombinationsOptions<T> = (typeof accOrOptions !== 'function' ? accOrOptions : o) ?? {};

  const type = options.type ?? 'intersection';

  // extract all sets
  // O(N)
  const sets =
    options.sets ??
    extractSets(elements, acc, {
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

  const setLookup: Record<string, [ISet<T>, number]> = Object.create(null);
  sets.forEach((set, i) => {
    setLookup[set.name] = [set, i];
  });
  const isSortedAlphabetically = sets
    .map((d) => d.name)
    .sort()
    .every((d, i) => sets[i].name === d);
  const bySet = isSortedAlphabetically
    ? undefined
    : (a: string, b: string) => {
        const ai = setLookup[a]?.[1] ?? -1;
        const bi = setLookup[b]?.[1] ?? -1;
        return ai - bi;
      };
  const validSet = options.sets == null && options.setLimit == null ? null : new Set(sets.map((d) => d.name));
  const joiner = options.joiner ?? SET_JOINERS[type];
  const cs: ISetCombination<T>[] = [];
  const csLookup: Record<string, IWriteAbleSetCombination<T>> = Object.create(null);
  const byDegree: IWriteAbleSetCombination<T>[][] = Array(sets.length + 1)
    .fill(0)
    .map((_) => []);

  function genName(setsOfElem: string[]) {
    switch (setsOfElem.length) {
      case 0:
        return '()';
      case 1:
        return setsOfElem[0];
      default:
        const sorted = setsOfElem.slice().sort(bySet);
        const joined = sorted.join(joiner);
        return '(' + joined + ')';
    }
  }

  function genKey(setsOfElem: string[]) {
    switch (setsOfElem.length) {
      case 0:
        return '';
      case 1:
        return setsOfElem[0];
      case 2: {
        if (
          (bySet != null && bySet(setsOfElem[0], setsOfElem[1]) > 0) ||
          (bySet == null && setsOfElem[1] > setsOfElem[0])
        ) {
          return setsOfElem[1] + '&' + setsOfElem[0];
        }
        return setsOfElem[0] + '&' + setsOfElem[1];
      }
      default:
        const sorted = setsOfElem.slice().sort(bySet);
        return sorted.join('&');
    }
  }

  function getOrCreateCombination(setsOfElem: string[]) {
    const key = genKey(setsOfElem);
    let entry = csLookup[key];
    if (entry) {
      return entry;
    }
    const newEntry: IWriteAbleSetCombination<T> = {
      type,
      name: genName(setsOfElem),
      degree: setsOfElem.length,
      sets: new Set(setsOfElem.map((s) => setLookup[s]![0])),
      cardinality: 0,
      elems: [],
    };
    csLookup[key] = newEntry;
    cs.push(newEntry);
    byDegree[newEntry.degree]!.push(newEntry);
    return newEntry;
  }

  // O(N)
  elements.forEach((elem) => {
    let setsOfElem = acc(elem);
    if (validSet) {
      setsOfElem = setsOfElem.filter((d) => validSet.has(d));
    }
    const c = getOrCreateCombination(setsOfElem);
    c.elems.push(elem);
    (c as { cardinality: number }).cardinality++;
  });

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
    if (node.elems.length < 1000) {
      agg[0].push(...node.elems);
    } else {
      agg.push(node.elems);
    }
    (children.get(node) ?? []).forEach((child) => visit(child, visited, agg));
  }

  byDegree.slice(1).forEach((level) => {
    // aggregate all children into a node by level
    // A = A + A&B + A&C + A&B&C
    // A&B = A&B + A&B&C
    level.forEach((node) => {
      const visited = new Set<IWriteAbleSetCombination<T>>();
      const agg: T[][] = [node.elems];
      (children.get(node) ?? []).forEach((child) => {
        visit(child, visited, agg);
      });
      const elems = agg.length === 1 ? agg[0] : agg.flat();
      Object.assign(node, { elems, cardinality: elems.length });
    });
  });

  return finalize();
}
