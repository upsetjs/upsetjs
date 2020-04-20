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
} from '@upsetjs/model';
import { UpSetSizeInfo } from './deriveSizeDependent';
import { generateId } from './utils';

function resolveNumericScale(factory: NumericScaleFactory | 'linear' | 'log'): NumericScaleFactory {
  if (factory === 'linear') {
    return linearScale;
  }
  if (factory === 'log') {
    return logScale;
  }
  return factory;
}

function resolveBandScale(factory: BandScaleFactory | 'band'): BandScaleFactory {
  return factory === 'band' ? bandScale : factory;
}

export declare type UpSetDataInfo<T> = {
  id: string;
  r: number;
  triangleSize: number;
  sets: {
    v: ISets<T>;
    keys: ReadonlyArray<string>;
    rv: ISets<T>;
    x: NumericScaleLike;
    y(s: ISet<T>): number;
    bandWidth: number;
    cy: number;
    format(v: number): string;
  };
  cs: {
    v: ISetCombinations<T>;
    keys: ReadonlyArray<string>;
    x(s: ISetCombination<T>): number;
    y: NumericScaleLike;
    bandWidth: number;
    cx: number;
    format(v: number): string;
    has(v: ISetCombination<T>, s: ISet<T>): boolean;
  };
  toKey(s: ISetLike<T>): string;
  toElemKey?(e: T): string;
  barLabelFontSize: number;
};

function areCombinations<T>(
  combinations: ISetCombinations<T> | GenerateSetCombinationsOptions
): combinations is ISetCombinations<T> {
  return Array.isArray(combinations);
}

export default function deriveDataDependent<T>(
  sets: ISets<T>,
  combinations: ISetCombinations<T> | GenerateSetCombinationsOptions,
  sizes: UpSetSizeInfo,
  numericScale: NumericScaleFactory | 'linear' | 'log',
  bandScale: BandScaleFactory | 'band',
  barLabelFontSize: number,
  dotPadding: number,
  barPadding: number,
  tickFontSize: number,
  toKey: (s: ISetLike<T>) => string,
  toElemKey?: (e: T) => string
): UpSetDataInfo<T> {
  const numericScaleFactory = resolveNumericScale(numericScale);
  const bandScaleFactory = resolveBandScale(bandScale);
  const cs = areCombinations(combinations) ? combinations : generateCombinations(sets, combinations);

  const setX = numericScaleFactory(
    sets.reduce((acc, d) => Math.max(acc, d.cardinality), 0),
    [sizes.sets.w, 0],
    {
      orientation: 'horizontal',
      fontSizeHint: tickFontSize,
    }
  );
  const setKeys = sets.map(toKey);
  const setY = bandScaleFactory(
    setKeys.slice().reverse(), // reverse order
    sizes.sets.h,
    sizes.padding
  );
  const csKeys = cs.map(toKey);
  const combinationX = bandScaleFactory(csKeys, sizes.cs.w, sizes.padding);
  const combinationY = numericScaleFactory(
    cs.reduce((acc, d) => Math.max(acc, d.cardinality), 0),
    [sizes.cs.h, barLabelFontSize],
    {
      orientation: 'vertical',
      fontSizeHint: tickFontSize,
    }
  );
  const r = (Math.min(setY.bandwidth(), combinationX.bandwidth()) / 2) * dotPadding;

  const triangleSize = Math.max(2, (Math.min(setY.bandwidth(), combinationX.bandwidth()) / 2) * barPadding);

  return {
    id: generateId(),
    r,
    triangleSize,
    sets: {
      v: sets,
      keys: setKeys,
      rv: sets.slice().reverse(),
      x: setX,
      y: (s) => setY(toKey(s))!,
      bandWidth: setY.bandwidth(),
      cy: setY.bandwidth() / 2 + sizes.cs.h,
      format: setX.tickFormat(),
    },
    cs: {
      v: cs,
      keys: cs.map(toKey),
      x: (s) => combinationX(toKey(s))!,
      y: combinationY,
      cx: combinationX.bandwidth() / 2,
      bandWidth: combinationX.bandwidth(),
      format: combinationY.tickFormat(),
      has: (v, s) => {
        const sk = toKey(s);
        return Array.from(v.sets).some((ss) => toKey(ss) === sk);
      },
    },
    toKey,
    toElemKey,
    barLabelFontSize,
  };
}
