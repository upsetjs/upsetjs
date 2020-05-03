/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */

import { ISetLike, UpSetQuery } from '@upsetjs/model';
import { CSSProperties, ReactNode } from 'react';

export interface UpSetReactStyles {
  chartLabel?: CSSProperties;
  axisTick?: CSSProperties;
  setLabel?: CSSProperties;
  barLabel?: CSSProperties;
  bar?: CSSProperties;
  dot?: CSSProperties;
  legend?: CSSProperties;
}

export interface UpSetAddonProps<S extends ISetLike<T>, T> {
  /**
   * the current set to visualize
   */
  set: S;
  /**
   * the addon width
   */
  width: number;
  /**
   * the addon height
   */
  height: number;
  /**
   * the theme of the UpSetJS plot
   */
  theme: 'dark' | 'light';
}

export interface UpSetSelectionAddonProps<S extends ISetLike<T>, T> extends UpSetAddonProps<S, T> {
  /**
   * the current selection of the plot
   */
  selection: ISetLike<T> | null | ReadonlyArray<T> | ((s: ISetLike<T>) => number);
  /**
   * the specified selection color
   */
  selectionColor: string;
  /**
   * the optional overlap of the selection with the current set
   */
  overlap: ReadonlyArray<T> | null;
}

export interface UpSetQueryAddonProps<S extends ISetLike<T>, T> extends UpSetAddonProps<S, T> {
  /**
   * the current query to show
   */
  query: UpSetQuery<T>;
  /**
   * the optional overlap of the query with the current set
   */
  overlap: ReadonlyArray<T> | null;
  /**
   * whether to render the query in secondary mode
   */
  secondary: boolean;
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
  render: (props: UpSetAddonProps<S, T>) => ReactNode;
  /**
   * optional react component to render the selection
   */
  renderSelection?: (props: UpSetSelectionAddonProps<S, T>) => ReactNode;
  /**
   * optional react component to render a query
   */
  renderQuery?: (props: UpSetQueryAddonProps<S, T>) => ReactNode;
}

export declare type UpSetAddons<S extends ISetLike<T>, T> = ReadonlyArray<UpSetAddon<S, T>>;

export interface UpSetStyleClassNames {
  legend?: string;
  chartLabel?: string;
  axisTick?: string;
  setLabel?: string;
  barLabel?: string;
  bar?: string;
  dot?: string;
}

export interface UpSetFontSizes {
  /**
   * @default 16px
   */
  chartLabel?: string;
  /**
   * @default 10px
   */
  axisTick?: string;
  /**
   * @default 16px
   */
  setLabel?: string;
  /**
   * @default 10px
   */
  barLabel?: string;
  /**
   * @default 10px
   */
  legend?: string;
}
