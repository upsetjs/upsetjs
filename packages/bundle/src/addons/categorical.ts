/**
 * @upsetjs/bundle
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { UpSetAddon } from '@upsetjs/react';
import { categoricalAddon as categoricalAddonImpl, ICategory, ICategoricalStyleProps } from '@upsetjs/addons';
import { ISetLike } from '@upsetjs/model';
import { UpSetReactElement } from '../react';

export { ICategoricalStyleProps, ICategory } from '@upsetjs/addons';
export { categoricalHistogram, ICategoryBin } from '@upsetjs/math';

/**
 * generates a categorical addon to render categorical distribution as UpSet.js addon for aggregated set data
 * @param prop accessor or name of the property within the element
 * @param elems list of elements or their minimum / maximum value for specifying the data domain
 * @param options additional options
 */
export function categoricalAddon<T>(
  prop: keyof T | ((v: T) => string),
  elems: readonly T[] | { categories: readonly (string | ICategory)[] },
  options: Partial<Pick<UpSetAddon<ISetLike<T>, T, UpSetReactElement>, 'size' | 'position' | 'name'>> &
    ICategoricalStyleProps = {}
): UpSetAddon<ISetLike<T>, T, UpSetReactElement> {
  return categoricalAddonImpl(prop, elems, options);
}
