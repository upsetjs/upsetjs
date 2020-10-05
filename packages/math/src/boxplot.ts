import boxplotImpl, {
  QuantileMethod as CustomQuantileMethod,
  quantilesFivenum,
  quantilesHigher,
  quantilesHinges,
  quantilesLinear,
  quantilesLower,
  quantilesMidpoint,
  quantilesNearest,
  quantilesType7,
} from '@sgratzl/boxplots';

export { IBoxPlot, QuantileMethod as CustomQuantileMethod } from '@sgratzl/boxplots';

const methodLookup: Record<QuantilesMethod, CustomQuantileMethod> = {
  hinges: quantilesHinges,
  fivenum: quantilesFivenum,
  type7: quantilesType7,
  quantiles: quantilesType7,
  linear: quantilesLinear,
  lower: quantilesLower,
  higher: quantilesHigher,
  nearest: quantilesNearest,
  midpoint: quantilesMidpoint,
};

export type QuantilesMethod =
  | 'hinges'
  | 'fivenum'
  | 'type7'
  | 'quantiles'
  | 'linear'
  | 'lower'
  | 'higher'
  | 'nearest'
  | 'midpoint';

export declare type BoxplotStatsOptions = {
  /**
   * specify the coefficient for the whiskers, use <=0 for getting min/max instead
   * the coefficient will be multiplied by the IQR
   * @default 1.5
   */
  coef?: number;
  /**
   * specify the quantile method to use
   * @default quantilesType7
   */
  quantiles?: QuantilesMethod | CustomQuantileMethod;
  /**
   * defines that it can be assumed that the array is sorted and just contains valid numbers
   * (which will avoid unnecessary checks and sorting)
   * @default false
   */
  validAndSorted?: boolean;
  /**
   * whiskers mode whether to compute the nearest element which is bigger/smaller than low/high whisker or
   * the exact value
   * @default 'nearest'
   */
  whiskersMode?: 'nearest' | 'exact';
  /**
   * delta epsilon to compare
   * @default 10e-3
   */
  eps?: number;
};

export function boxplot(data: readonly number[] | Float32Array | Float64Array, options: BoxplotStatsOptions = {}) {
  const o = Object.assign({}, options as Omit<BoxplotStatsOptions, 'quantiles'>, {
    quantiles: (typeof options.quantiles === 'function' || options.quantiles == null
      ? options.quantiles
      : methodLookup[options.quantiles!]!) as CustomQuantileMethod,
  });
  if (o.quantiles == null) {
    delete (o as any).quantiles;
  }
  return boxplotImpl(data, o);
}
