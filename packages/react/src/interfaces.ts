/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2020 Samuel Gratzl <sam@sgratzl.com>
 */
import React from 'react';
import {
  ISetLike,
  BandScaleFactory,
  NumericScaleFactory,
  UpSetQuery,
  ISet,
  ISetCombination,
  ISetCombinations,
  GenerateSetCombinationsOptions,
  ISets,
  UpSetQueries,
} from '@upsetjs/model';

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
  theme: 'dark' | 'light' | 'vega';
}

export declare type UpSetSelection<T> = ISetLike<T> | null | ReadonlyArray<T> | ((s: ISetLike<T>) => number);

export interface UpSetSelectionAddonProps<S extends ISetLike<T>, T> extends UpSetAddonProps<S, T> {
  /**
   * the current selection of the plot
   */
  selection: UpSetSelection<T>;
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
   * query index
   */
  index: number;
  /**
   * the optional overlap of the query with the current set
   */
  overlap: ReadonlyArray<T> | null;
  /**
   * whether to render the query in secondary mode
   */
  secondary: boolean;
}

export interface UpSetAddon<S extends ISetLike<T>, T, N> {
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
  render: (props: UpSetAddonProps<S, T>) => N;
  /**
   * optional react component to render the selection
   */
  renderSelection?: (props: UpSetSelectionAddonProps<S, T>) => N;
  /**
   * optional react component to render a query
   */
  renderQuery?: (props: UpSetQueryAddonProps<S, T>) => N;
}

export declare type UpSetAddons<S extends ISetLike<T>, T, N> = ReadonlyArray<UpSetAddon<S, T, N>>;

export interface UpSetBaseFontSizes {
  /**
   * @default 16px
   */
  setLabel?: string;
  /**
   * @default 10px
   */
  legend?: string;
  /**
   * @default 24px
   */
  title?: string;
  /**
   * @default 16px
   */
  description?: string;
  /**
   * @default 10px
   */
  exportLabel?: string;
}

export interface UpSetFontSizes extends UpSetBaseFontSizes {
  /**
   * @default 16px
   */
  chartLabel?: string;
  /**
   * @default 10px
   */
  axisTick?: string;
  /**
   * @default 10px
   */
  barLabel?: string;
}

export interface VennDiagramFontSizes extends UpSetBaseFontSizes {
  /**
   * @default 12px
   */
  valueLabel?: string;
}

export interface UpSetBaseMultiStyle<C> {
  setLabel?: C;
  legend?: C;
  title?: C;
  description?: C;
}

export interface UpSetMultiStyle<C> extends UpSetBaseMultiStyle<C> {
  chartLabel?: C;
  axisTick?: C;
  barLabel?: C;
  bar?: C;
  dot?: C;
}

export interface VennDiagramMultiStyle<C> extends UpSetBaseMultiStyle<C> {
  valueLabel?: C;
  set?: C;
}

export interface UpSetDataProps<T, N> {
  /**
   * the sets to visualize
   */
  sets: ISets<T>;
  /**
   * the set combinations to visualize or the generation options to generate the set combinations
   * by default all set intersections are computed
   */
  combinations?: ISetCombinations<T> | GenerateSetCombinationsOptions<T>;
  /**
   * optional function to identify the same sets
   * @param set the set to generate a key for
   */
  toKey?: (set: ISetLike<T>) => string;
  /**
   * optional function to identify the same element
   * @param elem the element the key for
   */
  toElemKey?: (elem: T) => string;
  /**
   * list of addons that should be rendered along the horizontal sets
   */
  setAddons?: UpSetAddons<ISet<T>, T, N>;
  /**
   * list of addons that should be rendered along the vertical set combinations
   */
  combinationAddons?: UpSetAddons<ISetCombination<T>, T, N>;
  /**
   * numeric scale to use, either constants 'linear' or 'log' or a custom factory function
   * @default linear
   */
  numericScale?: NumericScaleFactory | 'linear' | 'log';
  /**
   * band scale to use, either constant 'band' or a custom factory function
   * @default band
   */
  bandScale?: BandScaleFactory | 'band';
}

export interface VennDiagramDataProps<T> {
  /**
   * the sets to visualize
   */
  sets: ISets<T>;
  /**
   * the set combinations to visualize or the generation options to generate the distinct set combinations
   * by default all set distinct intersections are computed
   */
  combinations?:
    | ISetCombinations<T>
    | {
        /**
         * optional color merger
         **/
        mergeColors?: (colors: ReadonlyArray<string | undefined>) => string | undefined;
      };
  /**
   * optional function to identify the same sets
   * @param set the set to generate a key for
   */
  toKey?: (set: ISetLike<T>) => string;
  /**
   * optional function to identify the same element
   * @param elem the element the key for
   */
  toElemKey?: (elem: T) => string;

  valueFormat?: (cardinality: number) => string;
}

export interface UpSetLayoutProps {
  /**
   * width of the chart
   */
  width: number;
  /**
   * height of the chart
   */
  height: number;
  /**
   * padding within the svg
   * @default 5
   */
  padding?: number;
  /**
   * padding argument for scaleBand
   * @default 0.1
   */
  barPadding?: number;
  /**
   * padding factor the for dots
   * @default 0.7
   */
  dotPadding?: number;
  /**
   * width ratios for different plots
   * [set chart, set labels, intersection chart]
   * @default [0.21, 0.19, 0.7]
   */
  widthRatios?: [number, number, number];
  /**
   * height ratios for different plots
   * [intersection chart, set chart]
   * @default [0.6, 0.4]
   */
  heightRatios?: [number, number];
}

export interface VennDiagramLayoutProps {
  /**
   * width of the chart
   */
  width: number;
  /**
   * height of the chart
   */
  height: number;
  /**
   * padding within the svg
   * @default 5
   */
  padding?: number;
}

export interface UpSetSelectionProps<T = any> {
  /**
   * the selection of the plot. Can be a set like (set or set combination), an array of elements, or a function to compute the overlap to a given set
   */
  selection?: UpSetSelection<T>;
  /**
   * mouse hover listener, triggered when the user is over a set (combination)
   */
  onHover?: (selection: ISetLike<T> | null, evt: MouseEvent) => void;
  /**
   * mouse click listener, triggered when the user is clicking on a set (combination)
   */
  onClick?: (selection: ISetLike<T> | null, evt: MouseEvent) => void;
  /**
   * mouse context menu listener, triggered when the user right clicks on a set (combination)
   */
  onContextMenu?: (selection: ISetLike<T> | null, evt: MouseEvent) => void;
  /**
   * list of queries as an alternative to provide a single selection
   */
  queries?: UpSetQueries<T>;
}

export interface UpSetThemeProps {
  /**
   * color used to highlight the selection
   * @default orange
   */
  selectionColor?: string;
  /**
   * color used to highlight alternating background in the sets for easier comparison
   * set to false to disable alternating pattern
   */
  alternatingBackgroundColor?: string | false;
  /**
   * main color to render bars and dark dots
   * @default black
   */
  color?: string;
  /**
   * main color used when a selection is present
   * @default undefined
   */
  hasSelectionColor?: string;
  /**
   * main color to render text
   * @default black
   */
  textColor?: string;
  /**
   * color for the hover hint rects for set combinations
   */
  hoverHintColor?: string;
  /**
   * color for dots that indicate it is not a member
   */
  notMemberColor?: string;
}

export interface VennDiagramThemeProps {
  /**
   * color used to highlight the selection
   * @default orange
   */
  selectionColor?: string;
  /**
   * main color to render bars and dark dots
   * @default black
   */
  color?: string;
  /**
   * main color used when a selection is present
   * @default undefined
   */
  hasSelectionColor?: string;
  /**
   * main color to render text
   * @default black
   */
  textColor?: string;
  /**
   * main color to render text
   * @default black
   */
  valueTextColor?: string;

  /**
   * stroke color to render around sets
   * @default black
   */
  strokeColor?: string;
}

export declare type UpSetStyleClassNames = UpSetMultiStyle<string>;

export interface UpSetElementProps<T, C, N> {
  /**
   * optional unique id of the set element. Note: if set, it is will also be used as a CSS class suffix
   */
  id?: string;
  /**
   * optional class name for the SVG element
   */
  className?: string;
  /**
   * object of classnames for certain sub elements
   */
  classNames?: UpSetStyleClassNames;
  /**
   * style object applied to the SVG element
   */
  style?: C;
  /**
   * object for applying styles to certain sub elements
   */
  styles?: UpSetMultiStyle<C>;
  /**
   * factory to create extra react nodes for each set
   */
  setChildrenFactory?: (set: ISet<T>) => N;
  /**
   * factory to create extra react nodes for each set combination
   */
  combinationChildrenFactory?: (combination: ISetCombination<T>) => N;
}

export interface VennDiagramElementProps<C> {
  /**
   * optional unique id of the set element. Note: if set, it is will also be used as a CSS class suffix
   */
  id?: string;
  /**
   * optional class name for the SVG element
   */
  className?: string;
  /**
   * object of classnames for certain sub elements
   */
  classNames?: VennDiagramMultiStyle<string>;
  /**
   * style object applied to the SVG element
   */
  style?: C;
  /**
   * object for applying styles to certain sub elements
   */
  styles?: VennDiagramMultiStyle<C>;
}

export interface UpSetExportOptions {
  png?: boolean;
  svg?: boolean;
  vega?: boolean;
  dump?: boolean;
  share?: boolean;
}

export declare type UpSetThemes = 'light' | 'dark' | 'vega';

export interface UpSetBaseStyleProps<L> {
  /**
   * basic theme of the plot either 'light' or 'dark'
   * @default light
   */
  theme?: UpSetThemes;
  /**
   * show a legend of queries
   * enabled by default when queries are set
   */
  queryLegend?: boolean;
  /**
   * show export buttons
   * @default true
   */
  exportButtons?: boolean | UpSetExportOptions;
  /**
   * specify the overall font family, set to false to use the default font family
   * @default sans-serif
   */
  fontFamily?: string | false;
  /**
   * optional title text for the plot
   */
  title?: L;
  /**
   * optional description text for the plot
   */
  description?: L;
}

export interface UpSetStyleProps<L> extends UpSetBaseStyleProps<L> {
  /**
   * offset of the label on top or left of a bar
   * @default 2
   */
  barLabelOffset?: number;
  /**
   * set axis label
   * @default Set Size
   */
  setName?: L;
  /**
   * offset of the set name from the set x axis. 'auto' means that it will be guessed according to the current values
   * @default auto
   */
  setNameAxisOffset?: number | 'auto';
  /**
   * combination axis label
   * @default Intersection Size
   */
  combinationName?: L;
  /**
   * offset of the combination name from the combination y axis. 'auto' means that it will be guessed according to the current values
   * @default auto
   */
  combinationNameAxisOffset?: number | 'auto';
  /**
   * specify font sizes for different sub elements
   */
  fontSizes?: UpSetFontSizes;
  /**
   * render empty selection for better performance
   * @default true
   */
  emptySelection?: boolean;
}

export interface VennDiagramStyleProps<L> extends UpSetBaseStyleProps<L> {
  /**
   * specify font sizes for different sub elements
   */
  fontSizes?: VennDiagramFontSizes;
}

/**
 * the UpSetJS component properties, separated in multiple semantic sub interfaces
 */
export interface UpSetPropsG<T, C, N, L>
  extends UpSetDataProps<T, N>,
    UpSetLayoutProps,
    UpSetStyleProps<L>,
    UpSetThemeProps,
    UpSetElementProps<T, C, N>,
    UpSetSelectionProps<T> {
  children?: N;
}

export declare type UpSetProps<T = any> = UpSetPropsG<T, React.CSSProperties, React.ReactNode, React.ReactNode>;

export interface UpSetFullPropsG<T, C, N, L>
  extends Required<Omit<UpSetDataProps<T, N>, 'toElemKey'>>,
    Required<UpSetLayoutProps>,
    Required<UpSetStyleProps<L>>,
    Required<UpSetThemeProps>,
    Required<UpSetElementProps<T, C, N>>,
    UpSetSelectionProps<T> {
  children?: N;
  toElemKey?: (elem: T) => string;
}

export declare type UpSetFullProps<T = any> = UpSetFullPropsG<T, React.CSSProperties, React.ReactNode, React.ReactNode>;

export interface VennDiagramPropsG<T, C, N, L>
  extends VennDiagramDataProps<T>,
    VennDiagramLayoutProps,
    VennDiagramStyleProps<L>,
    VennDiagramThemeProps,
    VennDiagramElementProps<C>,
    UpSetSelectionProps<T> {
  children?: N;
}

export declare type VennDiagramProps<T = any> = VennDiagramPropsG<
  T,
  React.CSSProperties,
  React.ReactNode,
  React.ReactNode
>;

export interface VennDiagramFullPropsG<T, C, N, L>
  extends Required<Omit<VennDiagramDataProps<T>, 'toElemKey'>>,
    Required<VennDiagramLayoutProps>,
    Required<VennDiagramStyleProps<L>>,
    Required<VennDiagramThemeProps>,
    Required<VennDiagramElementProps<C>>,
    UpSetSelectionProps<T> {
  toElemKey?: (elem: T) => string;
  children?: N;
}

export declare type VennDiagramFullProps<T = any> = VennDiagramFullPropsG<
  T,
  React.CSSProperties,
  React.ReactNode,
  React.ReactNode
>;
