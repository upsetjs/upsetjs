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
  combinations?: ISetCombinations<T> | GenerateSetCombinationsOptions;
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

export interface UpSetReactStyleProps<T> {
  styles?: UpSetReactStyles;
  style?: React.CSSProperties;
  childrenFactories?: UpSetReactChildrens<T>;
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
  alternatingBackgroundColor: '#f5f5f5',
};
const darkTheme: Required<UpSetThemeProps> = {
  selectionColor: '#ffa500',
  color: '#cccccc',
  textColor: '#ffffff',
  hoverHintColor: '#d9d9d9',
  notMemberColor: '#666666',
  alternatingBackgroundColor: '#444444',
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

export interface UpSetStyleProps extends UpSetThemeProps {
  className?: string;
  classNames?: UpSetStyleClassNames;
  theme?: 'light' | 'dark';
  triangleSize?: number;
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

  fontSizes?: {
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
  };

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
  UpSetReactStyleProps<T> &
  UpSetSelectionProps<T> & {
    styles: UpSetReactStyles;
    childrenFactories: UpSetReactChildrens<T>;
  } {
  const theme = getTheme(props.theme);
  return Object.assign(
    {
      theme: 'light',
      padding: 20,
      barPadding: 0.3,
      combinations: { type: 'intersection' },
      selection: null,
      combinationName:
        props.combinations != null && !areCombinations(props.combinations) && props.combinations.type === 'union'
          ? 'Union Size'
          : 'Intersection Size',
      barLabelOffset: 2,
      setNameAxisOffset: 12,
      combinationNameAxisOffset: 30,
      setName: 'Set Size',
      triangleSize: 5,
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
      styles: {},
      childrenFactories: {},
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
