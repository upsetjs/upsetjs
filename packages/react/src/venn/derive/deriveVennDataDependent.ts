/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import {
  generateCombinations,
  ISetCombinations,
  ISetLike,
  ISets,
  ISet,
  ISetCombination,
  GenerateSetCombinationsOptions,
} from '@upsetjs/model';
import { generateId } from '../../utils';
import { ITextCircle, ITextArcSlice } from '../layout/interfaces';
import vennDiagramLayout from '../layout/vennDiagramLayout';
import { VennDiagramSizeInfo } from './deriveVennSizeDependent';
import { areCombinations } from '../../derive/deriveDataDependent';

export declare type VennDiagramDataInfo<T> = {
  id: string;
  format(v: number): string;
  sets: {
    d: ReadonlyArray<{ v: ISet<T>; l: ITextCircle; key: string }>;
    v: ISets<T>;
    format(v: number): string;
  };
  cs: {
    d: ReadonlyArray<{ v: ISetCombination<T>; l: ITextArcSlice; key: string }>;
    v: ISetCombinations<T>;
    has(v: ISetCombination<T>, s: ISet<T>): boolean;
  };
  toKey(s: ISetLike<T>): string;
  toElemKey?(e: T): string;
};

export default function deriveVennDataDependent<T>(
  sets: ISets<T>,
  combinations: ISetCombinations<T> | GenerateSetCombinationsOptions,
  size: VennDiagramSizeInfo,
  valueFormat: (v: number) => string,
  toKey: (s: ISetLike<T>) => string,
  toElemKey?: (e: T) => string,
  id?: string
): VennDiagramDataInfo<T> {
  const ss = sets.length > 3 ? sets.slice(0, 3) : sets;
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
    cs = generateCombinations(helperSets, {
      type: 'distinctIntersection',
      min: 1,
      empty: true,
      order: ['degree:asc', 'group:asc'],
    }).map((c) => {
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
      Object.assign({}, combinations ?? {}, {
        type: 'distinctIntersection',
        min: 1,
        empty: true,
        order: ['degree:asc', 'group:asc'],
      } as GenerateSetCombinationsOptions)
    );
  }

  const csKeys = cs.map(toKey);

  const layout = vennDiagramLayout(ss.length, size.area);

  return {
    id: id ? id : generateId(),
    sets: {
      d: layout.sets.map((l, i) => ({ v: ss[i], l, key: setKeys[i] })),
      v: ss,
      format: valueFormat,
    },
    format: valueFormat,
    cs: {
      d: layout.intersections.map((l, i) => ({ v: cs[i], l, key: csKeys[i] })),
      v: cs,
      has: (v, s) => {
        const sk = toKey(s);
        return Array.from(v.sets).some((ss) => toKey(ss) === sk);
      },
    },
    toKey,
    toElemKey,
  };
}
