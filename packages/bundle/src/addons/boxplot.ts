/**
 * @upsetjs/bundle
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { UpSetAddon } from '../react';
import {
  boxplotAddon as boxplotAddonImpl,
  IBoxplotStylePlainProps,
  boxplotAggregatedAddon as boxplotAggregatedAddonImpl,
} from '@upsetjs/addons';
import { IBoxPlot } from '@upsetjs/math';

export { boxplot, BoxplotStatsOptions, IBoxPlot, QuantilesMethod } from '@upsetjs/math';

export interface IBoxplotStyleProps extends IBoxplotStylePlainProps {
  /**
   * custom styles applied to the box element
   */
  boxStyle?: CSSStyleDeclaration;
  /**
   * custom styles applied to the whisker element
   */
  lineStyle?: CSSStyleDeclaration;
  /**
   * custom styles applied to the outlier elements
   */
  outlierStyle?: CSSStyleDeclaration;
}

/**
 * generates a boxplot addon to render box plots as UpSet.js addon for aggregated set data
 * @param prop accessor or name of the property within the element
 * @param elems list of elements or their minimum / maximum value for specifying the data domain
 * @param options additional options
 */
export function boxplotAddon<T>(
  prop: keyof T | ((v: T) => number),
  elems: readonly T[] | { min: number; max: number },
  options: Partial<Pick<UpSetAddon<T>, 'size' | 'position' | 'name'>> & IBoxplotStyleProps = {}
): UpSetAddon<T> {
  return boxplotAddonImpl(
    prop,
    elems,
    options as Partial<Pick<UpSetAddon<T>, 'size' | 'position' | 'name'>> &
      IBoxplotStyleProps & { boxStyle: any; lineStyle: any; outlierStyle: any }
  );
}

/**
 * generates a boxplot addon to render box plots as UpSet.js addon for aggregated set data
 * @param acc accessor
 * @param elems list of elements or their minimum / maximum value for specifying the data domain
 * @param options additional options
 */
export function boxplotAggregatedAddon<T>(
  acc: (v: readonly T[]) => IBoxPlot,
  domain: { min: number; max: number },
  options: Partial<Pick<UpSetAddon<T>, 'size' | 'position' | 'name'>> & IBoxplotStyleProps = {}
): UpSetAddon<T> {
  return boxplotAggregatedAddonImpl(
    acc,
    domain,
    options as Partial<Pick<UpSetAddon<T>, 'size' | 'position' | 'name'>> &
      IBoxplotStyleProps & { boxStyle: any; lineStyle: any; outlierStyle: any }
  );
}
