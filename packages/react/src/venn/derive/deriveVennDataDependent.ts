/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { generateCombinations, ISetCombinations, ISetLike, ISets, ISet, ISetCombination } from '@upsetjs/model';
import { generateId } from '../../utils';
import { ITextCircle, ITextArcSlice } from '../layout/interfaces';
import vennDiagramLayout from '../layout/vennDiagramLayout';
import { VennDiagramSizeInfo } from './deriveVennSizeDependent';

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
  size: VennDiagramSizeInfo,
  valueFormat: (v: number) => string,
  toKey: (s: ISetLike<T>) => string,
  toElemKey?: (e: T) => string,
  id?: string
): VennDiagramDataInfo<T> {
  const cs = generateCombinations(sets, {
    type: 'distinctIntersection',
    min: 1,
    empty: true,
    order: ['degree:asc', 'group:asc'],
    toElemKey,
  });

  const csKeys = cs.map(toKey);
  const setKeys = sets.map(toKey);

  const layout = vennDiagramLayout(sets.length, size.area);

  return {
    id: id ? id : generateId(),
    sets: {
      d: layout.sets.map((l, i) => ({ v: sets[i], l, key: setKeys[i] })),
      v: sets,
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
