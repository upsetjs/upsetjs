/**
 * @upsetjs/bundle
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { UpSetCSSStyles } from '../react';
import { UpSetAddon } from '../interfaces';
import { categoricalAddon as categoricalAddonImpl } from '@upsetjs/addons';
import { ISetLike } from '@upsetjs/model';

export declare interface ICategory {
  value: string;
  color?: string;
  label?: string;
}

export interface ICategoricalStyleProps {
  /**
   * orientation of the categorical distribution
   * @default horizontal
   */
  orient?: 'horizontal' | 'vertical';
  /**
   * custom styles applied to the box element
   */
  rectStyle?: UpSetCSSStyles;
}

/**
 * generates a categorical addon to render categorical distribution as UpSet.js addon for aggregated set data
 * @param prop accessor or name of the property within the element
 * @param elems list of elements or their minimum / maximum value for specifying the data domain
 * @param options additional options
 */
export function categoricalAddon<T>(
  prop: keyof T | ((v: T) => string),
  elems: ReadonlyArray<T> | { categories: ReadonlyArray<string | ICategory> },
  options: Partial<Pick<UpSetAddon<ISetLike<T>, T>, 'size' | 'position' | 'name'>> & ICategoricalStyleProps = {}
): UpSetAddon<ISetLike<T>, T> {
  return categoricalAddonImpl(prop, elems, options);
}
