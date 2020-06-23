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
  NumericScaleFactory,
} from '@upsetjs/model';
import { generateId } from '../../utils';
import { VennDiagramSizeInfo } from '../../venn/derive/deriveVennSizeDependent';
import { calculateCombinations } from '../../venn/derive/deriveVennDataDependent';
import { generate } from '../layout';
import { resolveNumericScale } from '../../derive/deriveDataDependent';

export declare type IPoints = readonly { x: number; y: number }[];

export declare type KarnaughMapDataInfo<T> = {
  id: string;
  grid: {
    x: number;
    y: number;
    hCells: number;
    vCells: number;
  };
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
    scale(s: ISetCombination<T>): number;
  };
  toKey(s: ISetLike<T>): string;
  toElemKey?(e: T): string;
};

export default function deriveKarnaughDataDependent<T>(
  sets: ISets<T>,
  combinations: ISetCombinations<T> | GenerateSetCombinationsOptions,
  size: VennDiagramSizeInfo,
  numericScale: NumericScaleFactory | 'linear' | 'log',
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
  const numericScaleFactory = resolveNumericScale(numericScale);

  const scale = numericScaleFactory(
    cs.reduce((acc, c) => Math.max(acc, c.cardinality), 0),
    [1, l.cell - 1],
    {
      orientation: 'vertical',
      fontSizeHint: 10, // TODO
    }
  );

  return {
    id: id ? id : generateId(),
    grid: l.grid,
    sets: {
      l: l.s,
      v: sets,
      format: scale.tickFormat(),
    },
    cell: l.cell,
    cs: {
      l: l.c,
      v: cs,
      has,
      scale: (c) => scale(c.cardinality),
    },
    toKey,
    toElemKey,
  };
}
