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
  NumericScaleLike,
} from '@upsetjs/model';
import { generateId } from '../../utils';
import { VennDiagramSizeInfo } from '../../venn/derive/deriveVennSizeDependent';
import { calculateCombinations } from '../../venn/derive/deriveVennDataDependent';
import { generate } from '../layout';
import { resolveNumericScale } from '../../derive/deriveDataDependent';

export declare type IPoints = readonly { x: number; y: number }[];

export declare type KMapDataInfo<T> = {
  id: string;
  grid: {
    x: number;
    y: number;
    hCells: number;
    vCells: number;
  };
  triangleSize: number;
  cell: number;
  sets: {
    keys: string[];
    l: readonly { hor: boolean; text: IPoints; notText: IPoints }[];
    v: ISets<T>;
    format(v: number): string;
  };
  cs: {
    keys: string[];
    l: { x: number; y: number }[];
    v: ISetCombinations<T>;
    has(v: ISetCombination<T>, s: ISet<T>): boolean;
    scale: NumericScaleLike;
    bandWidth: number;
  };
  toKey(s: ISetLike<T>): string;
  toElemKey?(e: T): string;
};

export default function deriveKarnaughDataDependent<T>(
  sets: ISets<T>,
  combinations: ISetCombinations<T> | GenerateSetCombinationsOptions,
  size: VennDiagramSizeInfo,
  numericScale: NumericScaleFactory | 'linear' | 'log',
  barLabelFontSize: number,
  barPadding: number,
  setLabelFontSize: number,
  tickFontSize: number,
  toKey: (s: ISetLike<T>) => string,
  toElemKey?: (e: T) => string,
  id?: string
): KMapDataInfo<T> {
  const numericScaleFactory = resolveNumericScale(numericScale);
  const { cs, csKeys, setKeys } = calculateCombinations<T>(sets, toKey, combinations, { min: 0, empty: false });

  const has = (v: ISetCombination<T>, s: ISet<T>) => {
    const sk = toKey(s);
    return Array.from(v.sets).some((ss) => toKey(ss) === sk);
  };
  const l = generate(sets, cs, has, {
    width: size.area.w,
    height: size.area.h,
    labelHeight: setLabelFontSize,
  });

  const maxCSCardinality = cs.reduce((acc, d) => Math.max(acc, d.cardinality), 0);
  const scale = numericScaleFactory(maxCSCardinality, [l.cell, barLabelFontSize], {
    orientation: 'vertical',
    fontSizeHint: tickFontSize,
  });
  const bandWidth = Math.round(l.cell * (1 - barPadding));
  const triangleSize = Math.max(2, (bandWidth / 2) * barPadding);

  return {
    id: id ? id : generateId(),
    grid: l.grid,
    sets: {
      keys: setKeys,
      l: l.s,
      v: sets,
      format: scale.tickFormat(),
    },
    triangleSize,
    cell: l.cell,
    cs: {
      keys: csKeys,
      l: l.c,
      v: cs,
      has,
      scale,
      bandWidth,
    },
    toKey,
    toElemKey,
  };
}
