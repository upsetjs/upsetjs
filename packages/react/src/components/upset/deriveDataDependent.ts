import {
  ISetCombinations,
  ISets,
  NumericScaleLike,
  BandScaleLike,
  NumericScaleFactory,
  BandScaleFactory,
  GenerateSetCombinationsOptions,
  generateCombinations,
} from '@upsetjs/model';
import { UpSetSizeInfo } from './deriveSizeDependent';
import { scaleBand, scaleLinear, scaleLog } from 'd3-scale';
import { generateId } from './utils';

function linearScale(domain: [number, number], range: [number, number]): NumericScaleLike {
  return scaleLinear().domain(domain).range(range);
}

function logScale(domain: [number, number], range: [number, number]): NumericScaleLike {
  return scaleLog()
    .domain([Math.max(domain[0], 1), domain[1]])
    .range(range);
}

function bandScale(domain: string[], range: [number, number], padding: number): BandScaleLike {
  return scaleBand().domain(domain).range(range).padding(padding);
}

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
  barPadding: number
): UpSetDataInfo<T> {
  const numericScaleFactory = resolveNumericScale(numericScale);
  const bandScaleFactory = resolveBandScale(bandScale);
  const cs = areCombinations(combinations) ? combinations : generateCombinations(sets, combinations);

  const setY = bandScaleFactory(
    sets.map((d) => d.name).reverse(), // reverse order
    [0, sizes.sets.h],
    sizes.padding
  );
  const combinationX = bandScaleFactory(
    cs.map((d) => d.name),
    [0, sizes.cs.w],
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
      x: numericScaleFactory([0, sets.reduce((acc, d) => Math.max(acc, d.cardinality), 0)], [sizes.sets.w, 0]),
      y: setY,
      bandWidth: setY.bandwidth(),
      cy: setY.bandwidth() / 2 + sizes.cs.h,
    },
    cs: {
      v: cs,
      x: combinationX,
      y: numericScaleFactory(
        [0, cs.reduce((acc, d) => Math.max(acc, d.cardinality), 0)],
        [sizes.cs.h, barLabelFontSize]
      ),
      cx: combinationX.bandwidth() / 2,
      bandWidth: combinationX.bandwidth(),
    },
  };
}
