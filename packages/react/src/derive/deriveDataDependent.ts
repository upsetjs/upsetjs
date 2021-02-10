/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import {
  ISetCombinations,
  ISets,
  NumericScaleLike,
  NumericScaleFactory,
  BandScaleFactory,
  GenerateSetCombinationsOptions,
  generateCombinations,
  linearScale,
  logScale,
  bandScale,
  ISetLike,
  ISet,
  ISetCombination,
  generateOverlapFunction,
  ISetOverlapFunction,
} from '@upsetjs/model';
import type { ReactNode } from 'react';
import type { UpSetSizeInfo } from './deriveSizeDependent';
import { generateId, noGuessPossible } from '../utils';
import { DEFAULT_COMBINATIONS } from '../defaults';
import type { UpSetAddon, UpSetDataProps } from '../interfaces';

export function resolveNumericScale(
  factory: NonNullable<UpSetDataProps<any, any>['numericScale']>
): NumericScaleFactory {
  if (factory === 'linear') {
    return linearScale;
  }
  if (factory === 'log') {
    return logScale;
  }
  return factory;
}

function resolveBandScale(factory: NonNullable<UpSetDataProps<any, any>['bandScale']>): BandScaleFactory {
  return factory === 'band' ? bandScale : factory;
}

export interface UpSetDataInfo<T> {
  id: string;
  r: number;
  triangleSize: number;
  sets: {
    v: ISets<T>;
    keys: readonly string[];
    rv: ISets<T>;
    x: NumericScaleLike;
    xAxisWidth: number;
    y(s: ISet<T>): number;
    max: number;
    bandWidth: number;
    cy: number;
    format(v: number): string;
    labelOffset: number;
  };
  cs: {
    v: ISetCombinations<T>;
    keys: readonly string[];
    x(s: ISetCombination<T>): number;
    max: number;
    y: NumericScaleLike;
    yAxisWidth: number;
    bandWidth: number;
    cx: number;
    format(v: number): string;
    has(v: ISetCombination<T>, s: ISet<T>): boolean;
    labelOffset: number;
  };
  toKey(s: ISetLike<T>): string;
  toElemKey?(e: T): string;
  overlapGuesser: ISetOverlapFunction<T>;
}

export function areCombinations<T>(
  combinations: ISetCombinations<T> | GenerateSetCombinationsOptions
): combinations is ISetCombinations<T> {
  return Array.isArray(combinations);
}

export default function deriveDataDependent<T>(
  sets: ISets<T>,
  combinations: ISetCombinations<T> | GenerateSetCombinationsOptions,
  sizes: UpSetSizeInfo,
  numericScale: NonNullable<UpSetDataProps<any, any>['numericScale']>,
  bandScale: NonNullable<UpSetDataProps<any, any>['bandScale']>,
  barLabelFontSize: number,
  dotPadding: number,
  barPadding: number,
  tickFontSize: number,
  combinationAddons: readonly UpSetAddon<any, any, ReactNode>[],
  toKey: (s: ISetLike<T>) => string,
  toElemKey?: (e: T) => string,
  id?: string,
  setMaxScale?: number,
  combinationMaxScale?: number
): UpSetDataInfo<T> {
  const numericScaleFactory = resolveNumericScale(numericScale);
  const bandScaleFactory = resolveBandScale(bandScale);
  const cs = areCombinations(combinations)
    ? combinations
    : generateCombinations(sets, Object.assign({ toElemKey }, DEFAULT_COMBINATIONS, combinations));

  const csKeys = cs.map(toKey);
  const combinationX = bandScaleFactory(csKeys, sizes.cs.w, sizes.padding);
  const dataCSCardinality = cs.reduce((acc, d) => Math.max(acc, d.cardinality), 0);
  const maxCSCardinality = combinationMaxScale ?? dataCSCardinality;
  const combinationYEnd = maxCSCardinality > dataCSCardinality ? 0 : barLabelFontSize;
  const combinationY = numericScaleFactory(maxCSCardinality, [sizes.cs.h, combinationYEnd], {
    orientation: 'vertical',
    fontSizeHint: tickFontSize,
  });
  const labelSize = (text: string) => Math.floor((barLabelFontSize / 1.4) * 0.7 * text.length);
  const guessLabelWidth = (v: number) => labelSize(combinationY.tickFormat()(v));

  const dataSetCardinality = sets.reduce((acc, d) => Math.max(acc, d.cardinality), 0);
  const maxSetCardinality = setMaxScale ?? dataSetCardinality;
  const largestSetLabelWidth = guessLabelWidth(maxSetCardinality);
  let largestCSLabelWidth = guessLabelWidth(maxCSCardinality);

  for (const addon of combinationAddons) {
    if (!addon.scale) {
      continue;
    }
    const ticks = addon.scale.ticks(3);
    const f = addon.scale.tickFormat();
    for (const tick of ticks) {
      const l = typeof tick === 'number' ? f(tick) : tick.label ?? f(tick.value);
      const size = labelSize(l);
      if (size > largestCSLabelWidth) {
        largestCSLabelWidth = size;
      }
    }
  }

  const setShift = maxSetCardinality > dataSetCardinality ? 0 : largestSetLabelWidth;
  const setX = numericScaleFactory(maxSetCardinality, [sizes.sets.w, setShift], {
    orientation: 'horizontal',
    fontSizeHint: tickFontSize,
  });
  const setKeys = sets.map(toKey);
  const setY = bandScaleFactory(
    setKeys.slice().reverse(), // reverse order
    sizes.sets.h,
    sizes.padding
  );
  const r = (Math.min(setY.bandwidth(), combinationX.bandwidth()) / 2) * dotPadding;

  const triangleSize = Math.max(2, (Math.min(setY.bandwidth(), combinationX.bandwidth()) / 2) * barPadding);

  return {
    id: id ? id : generateId(),
    r,
    triangleSize,
    sets: {
      v: sets,
      keys: setKeys,
      rv: sets.slice().reverse(),
      x: setX,
      xAxisWidth: sizes.sets.w - setShift,
      y: (s) => setY(toKey(s))!,
      max: maxSetCardinality,
      bandWidth: setY.bandwidth(),
      cy: setY.bandwidth() / 2 + sizes.cs.h,
      format: setX.tickFormat(),
      labelOffset: barLabelFontSize + 9 + 2,
    },
    cs: {
      v: cs,
      keys: cs.map(toKey),
      x: (s) => combinationX(toKey(s))!,
      max: maxCSCardinality,
      y: combinationY,
      yAxisWidth: sizes.cs.h - combinationYEnd,
      cx: combinationX.bandwidth() / 2,
      bandWidth: combinationX.bandwidth(),
      format: combinationY.tickFormat(),
      has: (v, s) => {
        const sk = toKey(s);
        return Array.from(v.sets).some((ss) => toKey(ss) === sk);
      },
      labelOffset: largestCSLabelWidth + 9 + 6,
    },
    toKey,
    toElemKey,
    overlapGuesser: generateOverlapFunction(cs, noGuessPossible, toKey),
  };
}
