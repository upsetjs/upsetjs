/**
 * @upsetjs/bundle
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetLike, ISet, ISetCombination } from '@upsetjs/model';
import { UpSetCSSStyles, UpSetReactElement } from './react';
import { UpSetAddonProps, UpSetQueryAddonProps, UpSetSelectionAddonProps } from '@upsetjs/react';
export * from './react';

export {
  UpSetDataProps,
  UpSetSizeProps,
  UpSetSelectionProps,
  UpSetStyleClassNames,
  UpSetThemeProps,
  UpSetFontSizes,
  UpSetStyleProps,
  UpSetAddonProps,
  UpSetSelectionAddonProps,
  UpSetQueryAddonProps,
} from '@upsetjs/react';

export interface UpSetPlainStyleStyles {
  chartLabel?: UpSetCSSStyles;
  axisTick?: UpSetCSSStyles;
  setLabel?: UpSetCSSStyles;
  barLabel?: UpSetCSSStyles;
  bar?: UpSetCSSStyles;
  dot?: UpSetCSSStyles;
  legend?: UpSetCSSStyles;
}

export interface UpSetAddon<S extends ISetLike<T>, T> {
  /**
   * addon name
   */
  name: string;
  /**
   * addon position before or after the bar
   * @default after
   */
  position?: 'before' | 'after';
  /**
   * size of this addon in pixel
   */
  size: number;

  /**
   * react component to render the addon
   */
  render: (props: UpSetAddonProps<S, T>) => UpSetReactElement;
  /**
   * optional react component to render the selection
   */
  renderSelection?: (props: UpSetSelectionAddonProps<S, T>) => UpSetReactElement;
  /**
   * optional react component to render a query
   */
  renderQuery?: (props: UpSetQueryAddonProps<S, T>) => UpSetReactElement;
}

export declare type UpSetAddons<S extends ISetLike<T>, T> = ReadonlyArray<UpSetAddon<S, T>>;

export interface UpSetPlainStyleProps<T = any> {
  /**
   * style object applied to the SVG element
   */
  style?: UpSetCSSStyles;
  /**
   * object for applying styles to certain sub elements
   */
  styles?: UpSetPlainStyleStyles;
  /**
   * list of addons that should be rendered along the horizontal sets
   */
  setAddons?: UpSetAddons<ISet<T>, T>;
  /**
   * list of addons that should be rendered along the vertical set combinations
   */
  combinationAddons?: UpSetAddons<ISetCombination<T>, T>;
  /**
   * factory to create extra react nodes for each set
   */
  setChildrenFactory?: (set: ISet<T>) => UpSetReactElement;
  /**
   * factory to create extra react nodes for each set combination
   */
  combinationChildrenFactory?: (combination: ISetCombination<T>) => UpSetReactElement;
  /**
   * set axis label
   * @default Set Size
   */
  setName?: string;
  /**
   * combination axis label
   * @default Intersection Size
   */
  combinationName?: string;
}
