/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import {
  GenerateSetCombinationsOptions,
  ISet,
  ISetCombination,
  ISetCombinations,
  ISetLike,
  ISets,
} from '@upsetjs/model';
import { generateId } from '../../utils';
import { VennDiagramSizeInfo } from '../../venn/derive/deriveVennSizeDependent';
import { calculateCombinations } from '../../venn/derive/deriveVennDataDependent';
import { generate } from '../layout';

export declare type IPoints = readonly { x: number; y: number }[];

export declare type KarnaughMapDataInfo<T> = {
  id: string;
  format(v: number): string;
  cell: number;
  sets: {
    l: readonly { hor: boolean; text: IPoints; notText: IPoints }[];
    v: ISets<T>;
    format(v: number): string;
  };
  cs: {
    l: { x: number; y: number }[];
    v: ISetCombinations<T>;
    has(v: ISetCombination<T>, s: ISet<T>): boolean;
  };
  toKey(s: ISetLike<T>): string;
  toElemKey?(e: T): string;
};

export default function deriveKarnaughDataDependent<T>(
  sets: ISets<T>,
  combinations: ISetCombinations<T> | GenerateSetCombinationsOptions,
  size: VennDiagramSizeInfo,
  format: (v: number) => string,
  toKey: (s: ISetLike<T>) => string,
  toElemKey?: (e: T) => string,
  id?: string
): KarnaughMapDataInfo<T> {
  const { cs } = calculateCombinations<T>(sets, toKey, combinations, { min: 0, empty: false });

  const has = (v: ISetCombination<T>, s: ISet<T>) => {
    const sk = toKey(s);
    return Array.from(v.sets).some((ss) => toKey(ss) === sk);
  };
  const l = generate(sets, cs, has, {
    width: size.area.w,
    height: size.area.h,
    labelHeight: 20,
  });

  return {
    id: id ? id : generateId(),
    sets: {
      l: l.s,
      v: sets,
      format,
    },
    format,
    cell: l.cell,
    cs: {
      l: l.c,
      v: cs,
      has,
    },
    toKey,
    toElemKey,
  };
}
