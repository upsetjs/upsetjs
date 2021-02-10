/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import {
  GenerateSetCombinationsOptions,
  ISet,
  ISetCombination,
  ISetCombinations,
  ISetLike,
  ISets,
  NumericScaleLike,
  generateCombinations,
  generateOverlapFunction,
  ISetOverlapFunction,
} from '@upsetjs/model';
import { generateId, noGuessPossible } from '../../utils';
import type { VennDiagramSizeInfo } from '../../venn/derive/deriveVennSizeDependent';
import { generate } from '../layout';
import { resolveNumericScale, areCombinations } from '../../derive/deriveDataDependent';
import type { KarnaughMapDataProps } from 'interfaces';

export declare type IPoints = readonly { x: number; y: number }[];

export interface KMapDataInfo<T> {
  id: string;
  grid: {
    x: number;
    y: number;
    hCells: number;
    vCells: number;
    levels: { x: number[]; y: number[] }[];
  };
  triangleSize: number;
  cell: number;
  sets: {
    keys: string[];
    labelHeight: number;
    l: readonly { hor: boolean; span: number; text: IPoints; notText: IPoints }[];
    v: ISets<T>;
    format(v: number): string;
  };
  cs: {
    barLabelFontSize: number;
    keys: string[];
    l: { x: number; y: number }[];
    v: ISetCombinations<T>;
    has(v: ISetCombination<T>, s: ISet<T>): boolean;
    scale: NumericScaleLike;
    bandWidth: number;
    labelOffset: number;
  };
  toKey(s: ISetLike<T>): string;
  toElemKey?(e: T): string;
  overlapGuesser: ISetOverlapFunction<T>;
}

export default function deriveKarnaughDataDependent<T>(
  sets: ISets<T>,
  combinations: ISetCombinations<T> | GenerateSetCombinationsOptions,
  size: VennDiagramSizeInfo,
  numericScale: NonNullable<KarnaughMapDataProps<any>['numericScale']>,
  barLabelFontSize: number,
  barPadding: number,
  setLabelFontSize: number,
  tickFontSize: number,
  toKey: (s: ISetLike<T>) => string,
  toElemKey?: (e: T) => string,
  id?: string,
  combinationMaxScale?: number
): KMapDataInfo<T> {
  const numericScaleFactory = resolveNumericScale(numericScale);
  const setKeys = sets.map(toKey);
  const cs = areCombinations(combinations)
    ? combinations
    : generateCombinations<T>(
        sets,
        Object.assign(
          {
            type: 'distinctIntersection',
          },
          combinations ?? {}
        )
      );
  const csKeys = cs.map(toKey);

  const has = (v: ISetCombination<T>, s: ISet<T>) => {
    const sk = toKey(s);
    return Array.from(v.sets).some((ss) => toKey(ss) === sk);
  };
  const labelHeight = Math.ceil(setLabelFontSize * 1.2);
  const l = generate(sets, cs, has, {
    width: size.area.w,
    height: size.area.h,
    labelHeight,
  });

  const maxCSCardinality = combinationMaxScale ?? cs.reduce((acc, d) => Math.max(acc, d.cardinality), 0);
  const scale = numericScaleFactory(maxCSCardinality, [l.cell, barLabelFontSize], {
    orientation: 'vertical',
    fontSizeHint: tickFontSize,
  });
  const bandWidth = Math.round(l.cell * (1 - barPadding));
  const triangleSize = Math.min(Math.max(2, (bandWidth / 2) * barPadding), 5);
  const guessLabelWidth = (v: number) => Math.floor((barLabelFontSize / 1.4) * 0.7 * scale.tickFormat()(v).length);

  const largestCSLabelWidth = guessLabelWidth(maxCSCardinality);

  return {
    id: id ? id : generateId(),
    grid: l.grid,
    sets: {
      keys: setKeys,
      l: l.s,
      v: sets,
      labelHeight,
      format: scale.tickFormat(),
    },
    triangleSize,
    cell: l.cell,
    cs: {
      keys: csKeys,
      l: l.c,
      v: cs,
      barLabelFontSize,
      has,
      scale,
      bandWidth,
      labelOffset: largestCSLabelWidth + 9 + 6,
    },
    toKey,
    toElemKey,
    overlapGuesser: generateOverlapFunction(cs, noGuessPossible, toKey),
  };
}
