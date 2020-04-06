import {
  ISetCombinations,
  ISets,
  NumericScaleLike,
  BandScaleLike,
  NumericScaleFactory,
  BandScaleFactory,
} from '@upsetjs/model';
import { UpSetStyles } from './defineStyle';
import { scaleBand, scaleLinear, scaleLog } from 'd3-scale';

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

export declare type UpSetScales = {
  sets: {
    x: NumericScaleLike;
    y: BandScaleLike;
  };
  combinations: {
    x: BandScaleLike;
    y: NumericScaleLike;
  };
};

export default function generateScales(
  sets: ISets<any>,
  combinations: ISetCombinations<any>,
  styles: UpSetStyles,
  numericScale: NumericScaleFactory | 'linear' | 'log',
  bandScale: BandScaleFactory | 'band',
  barLabelFontSize: number
): UpSetScales {
  const numericScaleFactory = resolveNumericScale(numericScale);
  const bandScaleFactory = resolveBandScale(bandScale);

  return {
    sets: {
      x: numericScaleFactory([0, sets.reduce((acc, d) => Math.max(acc, d.cardinality), 0)], [styles.sets.w, 0]),
      y: bandScaleFactory(
        sets.map((d) => d.name).reverse(), // reverse order
        [0, styles.sets.h],
        styles.padding
      ),
    },
    combinations: {
      x: bandScaleFactory(
        combinations.map((d) => d.name),
        [0, styles.combinations.w],
        styles.padding
      ),
      y: numericScaleFactory(
        [0, combinations.reduce((acc, d) => Math.max(acc, d.cardinality), 0)],
        [styles.combinations.h, barLabelFontSize]
      ),
    },
  };
}
