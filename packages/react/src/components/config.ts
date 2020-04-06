import {
  GenerateSetCombinationsOptions,
  ISetLike,
  ISets,
  ISetCombinations,
  BandScaleFactory,
  NumericScaleFactory,
  UpSetQuery,
  ISet,
  ISetCombination,
} from '@upsetjs/model';

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

export interface UpSetReactStyles {
  chartLabel?: React.CSSProperties;
  axisTick?: React.CSSProperties;
  setLabel?: React.CSSProperties;
  barLabel?: React.CSSProperties;
  bar?: React.CSSProperties;
  dot?: React.CSSProperties;
  legend?: React.CSSProperties;
}

export interface UpSetReactChildrens<T> {
  set?(set: ISet<T>): React.ReactNode;
  combinations?(combination: ISetCombination<T>): React.ReactNode;
}

export interface UpSetAddonProps<S extends ISetLike<T>, T> {
  set: S;
  width: number;
  height: number;
}

export interface UpSetSelectionAddonProps<S extends ISetLike<T>, T> extends UpSetAddonProps<S, T> {
  selection: ISetLike<T> | null | ReadonlyArray<T>;
}

export interface UpSetQueryAddonProps<S extends ISetLike<T>, T> extends UpSetAddonProps<S, T> {
  query: UpSetQuery<T>;
  secondary: boolean;
}

export interface UpSetAddon<S extends ISetLike<T>, T> {
  /**
   * @default after
   */
  position?: 'before' | 'after';
  /**
   * size of this addon in pixel
   */
  size: number;

  render(props: UpSetAddonProps<S, T>): React.ReactNode;

  renderSelection?(props: UpSetSelectionAddonProps<S, T>): React.ReactNode;

  renderQuery?(props: UpSetQueryAddonProps<S, T>): React.ReactNode;
}

export declare type UpSetAddons<S extends ISetLike<T>, T> = ReadonlyArray<UpSetAddon<S, T>>;

export interface UpSetReactStyleProps<T> {
  style?: React.CSSProperties;
  styles?: UpSetReactStyles;
  childrenFactories?: UpSetReactChildrens<T>;
  setAddons?: UpSetAddons<ISet<T>, T>;
  combinationAddons?: UpSetAddons<ISetCombination<T>, T>;
}

export interface UpSetThemeProps {
  selectionColor?: string;
  /**
   * set to false to disable alternating pattern
   */
  alternatingBackgroundColor?: string | false;
  color?: string;
  textColor?: string;
  hoverHintColor?: string;
  notMemberColor?: string;
}

const lightTheme: Required<UpSetThemeProps> = {
  selectionColor: '#ffa500',
  color: '#000000',
  textColor: '#000000',
  hoverHintColor: '#cccccc',
  notMemberColor: '#d3d3d3',
  alternatingBackgroundColor: '#0000000d',
};
const darkTheme: Required<UpSetThemeProps> = {
  selectionColor: '#ffa500',
  color: '#cccccc',
  textColor: '#ffffff',
  hoverHintColor: '#d9d9d9',
  notMemberColor: '#666666',
  alternatingBackgroundColor: '#ffffff33',
};

function getTheme(theme?: 'light' | 'dark') {
  return theme === 'dark' ? darkTheme : lightTheme;
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

export interface UpSetStyleProps extends UpSetThemeProps {
  className?: string;
  classNames?: UpSetStyleClassNames;
  theme?: 'light' | 'dark';
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

  fontSizes?: UpSetFontSizes;

  numericScale?: NumericScaleFactory | 'linear' | 'log';
  bandScale?: BandScaleFactory | 'band';

  setName?: string | React.ReactNode;
  combinationName?: string | React.ReactNode;
}

export type UpSetProps<T> = UpSetDataProps<T> &
  UpSetSizeProps &
  UpSetStyleProps &
  UpSetReactStyleProps<T> &
  UpSetSelectionProps<T>;

function areCombinations<T>(
  combinations: ISetCombinations<T> | GenerateSetCombinationsOptions
): combinations is ISetCombinations<T> {
  return Array.isArray(combinations);
}

export function fillDefaults<T>(
  props: UpSetProps<T>
): Required<UpSetDataProps<T>> &
  Required<UpSetSizeProps> &
  Required<UpSetStyleProps> &
  Required<UpSetReactStyleProps<T>> &
  UpSetSelectionProps<T> {
  const theme = getTheme(props.theme);
  return Object.assign(
    {
      theme: 'light',
      padding: 20,
      barPadding: 0.3,
      dotPadding: 0.7,
      combinations: { type: 'intersection' },
      selection: null,
      combinationName:
        props.combinations != null && !areCombinations(props.combinations) && props.combinations.type === 'union'
          ? 'Union Size'
          : 'Intersection Size',
      barLabelOffset: 2,
      setNameAxisOffset: 24,
      combinationNameAxisOffset: 30,
      setName: 'Set Size',
      fontFamily: 'sans-serif',
      widthRatios: [0.2, 0.1, 0.7],
      heightRatios: [0.6, 0.4],
      queries: [],
      queryLegend: props.queries != null && props.queries.length > 0,
      exportButtons: true,
      numericScale: 'linear',
      bandScale: 'band',
      className: '',
      classNames: {},
      style: {},
      styles: {},
      childrenFactories: {},
      setAddons: [],
      combinationAddons: [],
    },
    theme,
    props,
    {
      fontSizes: Object.assign(
        {
          setLabel: '16px',
          axisTick: '10px',
          chartLabel: '16px',
          barLabel: '10px',
          legend: '10px',
        },
        props.fontSizes ?? {}
      ),
    }
  );
}
