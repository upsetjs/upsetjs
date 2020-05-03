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
  set: S;
  width: number;
  height: number;
  theme: 'dark' | 'light';
}

export interface UpSetSelectionAddonProps<S extends ISetLike<T>, T> extends UpSetAddonProps<S, T> {
  selection: ISetLike<T> | null | ReadonlyArray<T> | ((s: ISetLike<T>) => number);
  selectionColor: string;
  overlap: ReadonlyArray<T> | null;
}

export interface UpSetQueryAddonProps<S extends ISetLike<T>, T> extends UpSetAddonProps<S, T> {
  query: UpSetQuery<T>;
  overlap: ReadonlyArray<T> | null;
  secondary: boolean;
}

export interface UpSetAddon<S extends ISetLike<T>, T> {
  name: string;
  /**
   * @default after
   */
  position?: 'before' | 'after';
  /**
   * size of this addon in pixel
   */
  size: number;

  render(props: UpSetAddonProps<S, T>): ReactNode;

  renderSelection?(props: UpSetSelectionAddonProps<S, T>): ReactNode;

  renderQuery?(props: UpSetQueryAddonProps<S, T>): ReactNode;
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
