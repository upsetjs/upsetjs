/**
 * @upsetjs/model
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISets, SetCombinationType, ISet, ISetCombination } from '../model';
import { SortSetOrder, postprocessSets } from './asSets';
import { SortCombinationOrder, SortCombinationOrders, postprocessCombinations } from './asCombinations';
import { SET_JOINERS } from './constants';

export interface ExtractFromExpressionOptions {
  type?: SetCombinationType;

  setOrder?: SortSetOrder;

  combinationOrder?: SortCombinationOrder | SortCombinationOrders;

  joiner?: string;
}
/**
 * extract sets and combinations out of a given list of static combination information.
 * In addition an accessor is used to specify the set names
 * @param combinations list of combinations
 * @param accessor accessor to get the list of sets the combination belong to
 * @param options hints about the given combinations
 */
export default function extractFromExpression<T extends { value: number }>(
  combinations: readonly T[],
  accessor: (elem: T) => string[],
  options?: ExtractFromExpressionOptions
): { sets: ISets<unknown>; combinations: readonly (T & ISetCombination<unknown>)[] };
/**
 * extract sets out of a given element array which have a `.sets` property
 * @param combinations
 * @param options hints about the given combinations
 */
export default function extractFromExpression<T extends { sets: string[]; value: number }>(
  combinations: readonly T[],
  options?: ExtractFromExpressionOptions
): { sets: ISets<unknown>; combinations: readonly (T & ISetCombination<unknown>)[] };

export default function extractFromExpression<T extends { value: number }>(
  combinations: readonly T[],
  accOrOptions?: ExtractFromExpressionOptions | ((elem: T) => string[]),
  o: ExtractFromExpressionOptions = {}
): { sets: ISets<unknown>; combinations: readonly (T & ISetCombination<unknown>)[] } {
  const acc = typeof accOrOptions === 'function' ? accOrOptions : (e: T) => ((e as unknown) as { sets: string[] }).sets;
  const options: ExtractFromExpressionOptions = (typeof accOrOptions !== 'function' ? accOrOptions : o) ?? {};

  const type = options.type ?? 'intersection';

  const joiner = options.joiner ?? SET_JOINERS[type];

  const sets: ISet<unknown>[] = [];
  const setLookup = new Map<string, ISet<unknown>>();

  const cs: (T & ISetCombination<unknown>)[] = combinations.map((c) => {
    const containedSets = acc(c);

    const containedSetsObjects = containedSets.map((s) => {
      if (setLookup.has(s)) {
        return setLookup.get(s)!;
      }
      const set: ISet<unknown> = {
        cardinality: 0,
        elems: [],
        name: s,
        type: 'set',
      };
      sets.push(set);
      setLookup.set(set.name, set);
      return set;
    });

    if (type === 'distinctIntersection') {
      // we can add the cardinality of a subset to the main set
      for (const s of containedSetsObjects) {
        (s as { cardinality: number }).cardinality += c.value;
      }
    } else if (containedSets.length === 1) {
      // merge into set
      Object.assign(
        containedSetsObjects[0],
        {
          cardinality: c.value,
        },
        c
      );
    }

    return Object.assign(
      {
        type,
        elems: [],
        name: containedSets.join(joiner),
      },
      c,
      {
        cardinality: c.value,
        degree: containedSets.length,
        sets: new Set(containedSetsObjects),
      }
    );
  });

  const sortedSets = postprocessSets(sets, {
    order: options.setOrder,
  });
  return {
    sets: sortedSets,
    combinations: postprocessCombinations(sortedSets, cs, {
      order: options.combinationOrder,
    }),
  };
}
