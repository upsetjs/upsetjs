/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import {
  generateCombinations,
  ISetCombinations,
  ISetLike,
  ISets,
  ISet,
  ISetCombination,
  GenerateSetCombinationsOptions,
  ISetOverlapFunction,
  generateDistinctOverlapFunction,
} from '@upsetjs/model';
import { generateId, noGuessPossible } from '../../utils';
import type { ITextCircle, ITextArcSlice, IVennDiagramLayoutGenerator, ITextEllipse } from '../layout/interfaces';
import type { VennDiagramSizeInfo } from './deriveVennSizeDependent';
import { areCombinations } from '../../derive/deriveDataDependent';

export interface VennDiagramDataInfo<T> {
  id: string;
  format(v: number): string;
  sets: {
    d: readonly { v: ISet<T>; l: ITextCircle | ITextEllipse; key: string }[];
    v: ISets<T>;
    format(v: number): string;
  };
  cs: {
    d: readonly { v: ISetCombination<T>; l: ITextArcSlice; key: string }[];
    v: ISetCombinations<T>;
    has(v: ISetCombination<T>, s: ISet<T>): boolean;
  };
  toKey(s: ISetLike<T>): string;
  toElemKey?(e: T): string;
  overlapGuesser: ISetOverlapFunction<T>;
}

export default function deriveVennDataDependent<T>(
  sets: ISets<T>,
  combinations: ISetCombinations<T> | GenerateSetCombinationsOptions,
  size: VennDiagramSizeInfo,
  layout: IVennDiagramLayoutGenerator,
  format: (v: number) => string,
  toKey: (s: ISetLike<T>) => string,
  toElemKey?: (e: T) => string,
  id?: string
): VennDiagramDataInfo<T> {
  const ss = sets.length > layout.maxSets ? sets.slice(0, layout.maxSets) : sets;
  const { cs, setKeys, csKeys } = calculateCombinations<T>(ss, toKey, combinations);

  const l = layout.compute(ss, cs, size.area.w, size.area.h);

  return {
    id: id ? id : generateId(),
    sets: {
      d: l.sets.map((l, i) => ({ v: ss[i], l, key: setKeys[i] })),
      v: ss,
      format,
    },
    format,
    cs: {
      d: l.intersections.map((l, i) => ({ v: cs[i], l, key: csKeys[i] })),
      v: cs,
      has: (v, s) => {
        const sk = toKey(s);
        return Array.from(v.sets).some((ss) => toKey(ss) === sk);
      },
    },
    toKey,
    toElemKey,
    overlapGuesser: generateDistinctOverlapFunction(cs, noGuessPossible, toKey),
  };
}

export function calculateCombinations<T>(
  ss: ISets<T>,
  toKey: (s: ISetLike<T>) => string,
  combinations: GenerateSetCombinationsOptions<any> | ISetCombinations<T>,
  options: GenerateSetCombinationsOptions<any> = { min: 1 }
) {
  const setKeys = ss.map(toKey);

  let cs: ISetCombinations<T> = [];
  if (areCombinations(combinations)) {
    const given = new Map(combinations.map((c) => [Array.from(c.sets).map(toKey).sort().join('#'), c]));
    const helperSets = ss.map((s) => ({
      type: 'set' as 'set',
      cardinality: 0,
      elems: [],
      name: s.name,
      s,
    }));
    // generate dummy ones and map to given data
    cs = generateCombinations(
      helperSets,
      Object.assign(
        {
          type: 'distinctIntersection',
          empty: true,
          order: ['degree:asc', 'group:asc'],
        },
        options
      )
    ).map((c) => {
      const key = Array.from(c.sets)
        .map((s) => toKey(((s as unknown) as { s: ISet<T> }).s))
        .sort()
        .join('#');
      if (given.has(key)) {
        return given.get(key)!;
      }
      // generate a dummy one
      return {
        name: c.name,
        cardinality: 0,
        degree: c.degree,
        elems: [],
        sets: new Set(Array.from(c.sets).map((s) => ((s as unknown) as { s: ISet<T> }).s)),
        type: 'distinctIntersection',
      } as ISetCombination<T>;
    });
  } else {
    cs = generateCombinations(
      ss,
      Object.assign(
        {
          type: 'distinctIntersection',
          empty: true,
          order: ['degree:asc', 'group:asc'],
        },
        options,
        combinations ?? {}
      )
    );
  }

  const csKeys = cs.map(toKey);
  return { cs, setKeys, csKeys };
}
