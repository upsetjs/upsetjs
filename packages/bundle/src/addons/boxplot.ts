/**
 * @upsetjs/bundle
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { BoxplotStatsOptions } from '@upsetjs/math';
import { UpSetCSSStyles } from '../react';
import { UpSetAddon } from '../interfaces';
import { boxplotAddon as boxplotAddonImpl } from '@upsetjs/addons';
import { ISetLike } from '@upsetjs/model';

export interface IBoxplotStyleProps extends BoxplotStatsOptions {
  /**
   * the render mode and level of detail to render
   * @default normal
   */
  mode?: 'normal' | 'box' | 'indicator';
  /**
   * orientation of the box plot
   * @default horizontal
   */
  orient?: 'horizontal' | 'vertical';
  /**
   * custom styles applied to the box element
   */
  boxStyle?: UpSetCSSStyles;
  /**
   * custom styles applied to the whisker element
   */
  lineStyle?: UpSetCSSStyles;
  /**
   * custom styles applied to the outlier elements
   */
  outlierStyle?: UpSetCSSStyles;
  /**
   * padding of the box from its corners
   * @default 0.1
   */
  boxPadding?: number;
  /**
   * radius of the outlier circles
   * @default 3
   */
  outlierRadius?: number;
  /**
   * number format used for the tooltip
   * @default .toFixed(2)
   */
  numberFormat?: (v: number) => string;
}

/**
 * generates a boxplot addon to render box plots as UpSet.js addon for aggregated set data
 * @param prop accessor or name of the property within the element
 * @param elems list of elements or their minimum / maximum value for specifying the data domain
 * @param options additional options
 */
export function boxplotAddon<T>(
  prop: keyof T | ((v: T) => number),
  elems: ReadonlyArray<T> | { min: number; max: number },
  options: Partial<Pick<UpSetAddon<ISetLike<T>, T>, 'size' | 'position' | 'name'>> & IBoxplotStyleProps = {}
): UpSetAddon<ISetLike<T>, T> {
  return boxplotAddonImpl(prop, elems, options);
}
