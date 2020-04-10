import {
  BandScaleFactory,
  GenerateSetCombinationsOptions,
  ISetCombinations,
  ISetLike,
  ISets,
  NumericScaleFactory,
  UpSetQuery,
  ISet,
  ISetCombination,
} from '@upsetjs/model';
import { UpSetCSSStyles, UpSetReactElement } from './react';
export * from './react';

export interface UpSetSizeProps {
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
   * @default 20
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
   * @default [0.25, 0.1, 0.65]
   */
  widthRatios?: [number, number, number];
  /**
   * height ratios for different plots
   * [intersection chart, set chart]
   * @default [0.6, 0.4]
   */
  heightRatios?: [number, number];
}

export interface UpSetDataProps<T> {
  /**
   * the sets to visualize
   */
  sets: ISets<T>;
  /**
   * the combinations to visualize by default all combinations
   */
  combinations?: ISetCombinations<T> | GenerateSetCombinationsOptions<T>;
}

export interface UpSetSelectionProps<T> {
  selection?: ISetLike<T> | null | ReadonlyArray<T>;
  onHover?(selection: ISetLike<T> | null): void;
  onClick?(selection: ISetLike<T> | null): void;

  queries?: ReadonlyArray<UpSetQuery<T>>;
}

export interface UpSetThemeProps {
  selectionColor?: string;
  alternatingBackgroundColor?: string | false;
  color?: string;
  textColor?: string;
  hoverHintColor?: string;
  notMemberColor?: string;
}

export interface UpSetStyleClassNames {
  legend?: string;
  chartLabel?: string;
  axisTick?: string;
  setLabel?: string;
  barLabel?: string;
  bar?: string;
  dot?: string;
}

export interface UpSetStyleFontSizes {
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

export interface UpSetStyleProps extends UpSetThemeProps {
  theme?: 'light' | 'dark';
  className?: string;
  classNames?: UpSetStyleClassNames;

  barLabelOffset?: number;
  setNameAxisOffset?: number;
  combinationNameAxisOffset?: number;
  /**
   * show a legend of queries
   * enabled by default when queries are set
   */
  queryLegend?: boolean;

  /**
   * show export buttons
   * @default true
   */
  exportButtons?: boolean;
  /**
   * set to false to use the default font family
   * @default sans-serif
   */
  fontFamily?: string | false;
  fontSizes?: UpSetStyleFontSizes;

  numericScale?: 'linear' | 'log' | NumericScaleFactory;
  bandScale?: 'band' | BandScaleFactory;

  setName?: string;
  combinationName?: string;
  /**
   * render empty selection for better performance
   * @default true
   */
  emptySelection?: boolean;
}

export interface UpSetPlainStyleStyles {
  chartLabel?: UpSetCSSStyles;
  axisTick?: UpSetCSSStyles;
  setLabel?: UpSetCSSStyles;
  barLabel?: UpSetCSSStyles;
  bar?: UpSetCSSStyles;
  dot?: UpSetCSSStyles;
  legend?: UpSetCSSStyles;
}

export interface UpSetAddonProps<S extends ISetLike<T>, T> {
  set: S;
  width: number;
  height: number;
}

export interface UpSetSelectionAddonProps<S extends ISetLike<T>, T> extends UpSetAddonProps<S, T> {
  selection: ISetLike<T> | null | ReadonlyArray<T>;
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

  render(props: UpSetAddonProps<S, T>): UpSetReactElement;

  renderSelection?(props: UpSetSelectionAddonProps<S, T>): UpSetReactElement;

  renderQuery?(props: UpSetQueryAddonProps<S, T>): UpSetReactElement;
}

export declare type UpSetAddons<S extends ISetLike<T>, T> = ReadonlyArray<UpSetAddon<S, T>>;

export interface UpSetPlainStyleProps<T> {
  style?: UpSetCSSStyles;
  styles?: UpSetPlainStyleStyles;

  setAddons?: UpSetAddons<ISet<T>, T>;
  combinationAddons?: UpSetAddons<ISetCombination<T>, T>;
}
