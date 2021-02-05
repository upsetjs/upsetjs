/**
 * @upsetjs/react
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */
import type React from 'react';
import type {
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
  NumericScaleLike,
} from '@upsetjs/model';
import type { IVennDiagramLayoutGenerator } from './venn/layout/interfaces';
export * from './venn/layout/interfaces';

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

export declare type UpSetSelection<T> = ISetLike<T> | null | readonly T[] | ((s: ISetLike<T>) => number);

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
  overlap: readonly T[] | null;
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
  overlap: readonly T[] | null;
  /**
   * whether to render the query in secondary mode
   */
  secondary: boolean;
}

export interface UpSetAddonHandlerInfo {
  readonly id: string;
  readonly name: string;
  readonly value: { toString(): void };
}

export declare type UpSetAddonHandlerInfos = readonly (UpSetAddonHandlerInfo | null)[];

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

  createOnHandlerData?: (s: S) => UpSetAddonHandlerInfo;

  scale?: NumericScaleLike;
}

export declare type UpSetAddons<S extends ISetLike<T>, T, N> = readonly UpSetAddon<S, T, N>[];

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

export interface KarnaughMapFontSizes extends UpSetBaseFontSizes {
  /**
   * @default 10px
   */
  axisTick?: string;
  /**
   * @default 10px
   */
  barLabel?: string;
  /**
   * @default 16px
   */
  chartLabel?: string;
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

export interface KarnaughMapMultiStyle<C> extends UpSetBaseMultiStyle<C> {
  chartLabel?: C;
  axisTick?: C;
  barLabel?: C;
  bar?: C;
  set?: C;
}

export interface UpSetBaseDataProps<T> {
  /**
   * the sets to visualize
   */
  sets: ISets<T>;
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
}

export interface UpSetDataProps<T, N> extends UpSetBaseDataProps<T> {
  /**
   * the set combinations to visualize or the generation options to generate the set combinations
   * by default all set intersections are computed
   */
  combinations?: ISetCombinations<T> | GenerateSetCombinationsOptions<T>;
  /**
   * list of addons that should be rendered along the horizontal sets
   */
  setAddons?: UpSetAddons<ISet<T>, T, N>;
  /**
   * list of addons that should be rendered along the vertical set combinations
   */
  combinationAddons?: UpSetAddons<ISetCombination<T>, T, N>;
  /**
   * padding between combination addons
   * @default 1
   */
  setAddonPadding?: number;
  /**
   * padding between combination addons
   * @default 1
   */
  combinationAddonPadding?: number;
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

  /**
   * maximum set scale value
   * @default derived from the sets
   */
  setMaxScale?: number;
  /**
   * maximum combination scale value
   * @default derived from the combinations
   */
  combinationMaxScale?: number;
}

export interface VennDiagramDataProps<T> extends UpSetBaseDataProps<T> {
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
        mergeColors?: (colors: readonly (string | undefined)[]) => string | undefined;
      };

  valueFormat?: (cardinality: number) => string;
}

export interface KarnaughMapDataProps<T> extends UpSetBaseDataProps<T> {
  /**
   * the set combinations to visualize or the generation options to generate the distinct set combinations
   * by default all set distinct intersections are computed
   */
  combinations?: ISetCombinations<T> | GenerateSetCombinationsOptions<T>;
  /**
   * numeric scale to use, either constants 'linear' or 'log' or a custom factory function
   * @default linear
   */
  numericScale?: NumericScaleFactory | 'linear' | 'log';
  /**
   * maximum combination scale value
   * @default derived from the combinations
   */
  combinationMaxScale?: number;
}

export interface UpSetBaseLayoutProps {
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

export interface UpSetLayoutProps extends UpSetBaseLayoutProps {
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
   * width ratios for different plots,
   * if a number larger than 1 is given, it is interpreted as pixel values
   * [set chart, set labels, intersection chart = derived]
   * @default [0.21, 0.19]
   */
  widthRatios?: [number, number];
  /**
   * height ratios for different plots,
   * if a number larger than 1 is given, it is interpreted as pixel values
   * [intersection chart, set chart = derived]
   * @default [0.6]
   */
  heightRatios?: [number];

  /**
   * alignment for the set labels
   * @default 'center'
   */
  setLabelAlignment?: 'left' | 'center' | 'right';
}

export interface VennDiagramLayoutProps extends UpSetBaseLayoutProps {
  /**
   * function used to perform the venn diagram layout
   */
  layout?: IVennDiagramLayoutGenerator;
}

export interface KarnaughMapLayoutProps extends UpSetBaseLayoutProps {
  /**
   * padding argument for scaleBand
   * @default 0.1
   */
  barPadding?: number;
}

export interface UpSetSelectionProps<T = any> {
  /**
   * the selection of the plot. Can be a set like (set or set combination), an array of elements, or a function to compute the overlap to a given set
   */
  selection?: UpSetSelection<T>;
  /**
   * mouse hover listener, triggered when the user is over a set (combination)
   * a combination of mouseEnter and mouseLeave
   */
  onHover?: (selection: ISetLike<T> | null, evt: MouseEvent, addonInfos: UpSetAddonHandlerInfos) => void;
  /**
   * mouse move over set listener, triggered when the user is over a set (combination)
   */
  onMouseMove?: (selection: ISetLike<T>, evt: MouseEvent, addonInfos: UpSetAddonHandlerInfos) => void;
  /**
   * mouse click listener, triggered when the user is clicking on a set (combination)
   */
  onClick?: (selection: ISetLike<T> | null, evt: MouseEvent, addonInfos: UpSetAddonHandlerInfos) => void;
  /**
   * mouse context menu listener, triggered when the user right clicks on a set (combination)
   */
  onContextMenu?: (selection: ISetLike<T> | null, evt: MouseEvent, addonInfos: UpSetAddonHandlerInfos) => void;
  /**
   * list of queries as an alternative to provide a single selection
   */
  queries?: UpSetQueries<T>;
}

export interface UpSetBaseThemeProps {
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
   * main opacity
   * @default undefined
   */
  opacity?: number;
  /**
   * main color used when a selection is present
   * @default undefined
   */
  hasSelectionColor?: string;
  /**
   * main opacity used when a selection is present
   * @default undefined
   */
  hasSelectionOpacity?: number;
  /**
   * main color to render text
   * @default black
   */
  textColor?: string;
}

export interface UpSetThemeProps extends UpSetBaseThemeProps {
  /**
   * color used to highlight alternating background in the sets for easier comparison
   * set to false to disable alternating pattern
   */
  alternatingBackgroundColor?: string | false;
  /**
   * color for the hover hint rects for set combinations
   */
  hoverHintColor?: string;
  /**
   * color for dots that indicate it is not a member
   */
  notMemberColor?: string;
}

export interface VennDiagramThemeProps extends UpSetBaseThemeProps {
  /**
   * main color to render text
   * @default black
   */
  valueTextColor?: string;

  /**
   * stroke color to render around sets or cells
   * @default black
   */
  strokeColor?: string;
  /**
   * whether to fill the circles
   * @default false
   */
  filled?: boolean;
}

export interface KarnaughMapThemeProps extends UpSetBaseThemeProps {
  /**
   * stroke color to render around sets or cells
   * @default black
   */
  strokeColor?: string;
}

export declare type UpSetStyleClassNames = UpSetMultiStyle<string>;

export interface UpSetBaseElementProps<C> {
  /**
   * optional unique id of the set element. Note: if set, it is will also be used as a CSS class suffix
   */
  id?: string;
  /**
   * optional class name for the SVG element
   */
  className?: string;
  /**
   * style object applied to the SVG element
   */
  style?: C;
}

export interface UpSetElementProps<T, C, N> extends UpSetBaseElementProps<C> {
  /**
   * object of classnames for certain sub elements
   */
  classNames?: UpSetStyleClassNames;
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

export interface VennDiagramElementProps<C> extends UpSetBaseElementProps<C> {
  /**
   * object of classnames for certain sub elements
   */
  classNames?: VennDiagramMultiStyle<string>;
  /**
   * object for applying styles to certain sub elements
   */
  styles?: VennDiagramMultiStyle<C>;
}
export interface KarnaughMapElementProps<C> extends UpSetBaseElementProps<C> {
  /**
   * object of classnames for certain sub elements
   */
  classNames?: KarnaughMapMultiStyle<string>;
  /**
   * object for applying styles to certain sub elements
   */
  styles?: KarnaughMapMultiStyle<C>;
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

  /**
   * whether to render tooltips aka title attributes
   * @default true
   */
  tooltips?: boolean;
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

export interface KarnaughMapStyleProps<L> extends UpSetBaseStyleProps<L> {
  /**
   * specify font sizes for different sub elements
   */
  fontSizes?: KarnaughMapFontSizes;
  /**
   * render empty selection for better performance
   * @default true
   */
  emptySelection?: boolean;
  /**
   * offset of the label on top or left of a bar
   * @default 2
   */
  barLabelOffset?: number;
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

export interface KarnaughMapPropsG<T, C, N, L>
  extends KarnaughMapDataProps<T>,
    KarnaughMapLayoutProps,
    KarnaughMapStyleProps<L>,
    KarnaughMapThemeProps,
    KarnaughMapElementProps<C>,
    UpSetSelectionProps<T> {
  children?: N;
}

export declare type KarnaughMapProps<T = any> = KarnaughMapPropsG<
  T,
  React.CSSProperties,
  React.ReactNode,
  React.ReactNode
>;

export interface KarnaughMapFullPropsG<T, C, N, L>
  extends Required<Omit<KarnaughMapDataProps<T>, 'toElemKey'>>,
    Required<KarnaughMapLayoutProps>,
    Required<KarnaughMapStyleProps<L>>,
    Required<KarnaughMapThemeProps>,
    Required<KarnaughMapElementProps<C>>,
    UpSetSelectionProps<T> {
  toElemKey?: (elem: T) => string;
  children?: N;
}

export declare type KarnaughMapFullProps<T = any> = KarnaughMapFullPropsG<
  T,
  React.CSSProperties,
  React.ReactNode,
  React.ReactNode
>;
