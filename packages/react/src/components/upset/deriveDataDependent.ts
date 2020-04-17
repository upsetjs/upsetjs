import {
  ISetCombinations,
  ISets,
  NumericScaleLike,
  BandScaleLike,
  NumericScaleFactory,
  BandScaleFactory,
  GenerateSetCombinationsOptions,
  generateCombinations,
  linearScale,
  logScale,
  bandScale,
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
    rv: ISets<T>;
    x: NumericScaleLike;
    y: BandScaleLike;
    bandWidth: number;
    cy: number;
  };
  cs: {
    v: ISetCombinations<T>;
    x: BandScaleLike;
    y: NumericScaleLike;
    bandWidth: number;
    cx: number;
  };
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
  tickFontSize: number
): UpSetDataInfo<T> {
  const numericScaleFactory = resolveNumericScale(numericScale);
  const bandScaleFactory = resolveBandScale(bandScale);
  const cs = areCombinations(combinations) ? combinations : generateCombinations(sets, combinations);

  const setY = bandScaleFactory(
    sets.map((d) => d.name).reverse(), // reverse order
    sizes.sets.h,
    sizes.padding
  );
  const combinationX = bandScaleFactory(
    cs.map((d) => d.name),
    sizes.cs.w,
    sizes.padding
  );
  const r = (Math.min(setY.bandwidth(), combinationX.bandwidth()) / 2) * dotPadding;

  const triangleSize = Math.max(2, (Math.min(setY.bandwidth(), combinationX.bandwidth()) / 2) * barPadding);

  return {
    id: generateId(),
    r,
    triangleSize,
    sets: {
      v: sets,
      rv: sets.slice().reverse(),
      x: numericScaleFactory(
        sets.reduce((acc, d) => Math.max(acc, d.cardinality), 0),
        [sizes.sets.w, 0],
        {
          orientation: 'horizontal',
          fontSizeHint: tickFontSize,
        }
      ),
      y: setY,
      bandWidth: setY.bandwidth(),
      cy: setY.bandwidth() / 2 + sizes.cs.h,
    },
    cs: {
      v: cs,
      x: combinationX,
      y: numericScaleFactory(
        cs.reduce((acc, d) => Math.max(acc, d.cardinality), 0),
        [sizes.cs.h, barLabelFontSize],
        {
          orientation: 'vertical',
          fontSizeHint: tickFontSize,
        }
      ),
      cx: combinationX.bandwidth() / 2,
      bandWidth: combinationX.bandwidth(),
    },
  };
}
