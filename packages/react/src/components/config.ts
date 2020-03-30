import {
  GenerateSetCombinationsOptions,
  ISetLike,
  ISets,
  ISetCombinations,
  NumericScaleLike,
  BandScaleLike,
  UpSetQuery,
} from '@upsetjs/model';
import { scaleBand, scaleLinear } from 'd3-scale';

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

export interface UpSetReactStyleProps {
  labelStyle?: React.CSSProperties;
  setLabelStyle?: React.CSSProperties;
  setNameStyle?: React.CSSProperties;
  axisStyle?: React.CSSProperties;
  combinationNameStyle?: React.CSSProperties;
  className?: string;
  style?: React.CSSProperties;
}

export interface UpSetThemeProps {
  selectionColor?: string;
  alternatingBackgroundColor?: string;
  color?: string;
  textColor?: string;
  hoverHintColor?: string;
  notMemberColor?: string;
}

const lightTheme: Required<UpSetThemeProps> = {
  selectionColor: 'orange',
  color: 'black',
  textColor: 'black',
  hoverHintColor: '#cccccc',
  notMemberColor: 'lightgray',
  alternatingBackgroundColor: '#f5f5f5',
};
const darkTheme: Required<UpSetThemeProps> = {
  selectionColor: 'orange',
  color: '#cccccc',
  textColor: 'white',
  hoverHintColor: '#d9d9d9',
  notMemberColor: '#666666',
  alternatingBackgroundColor: '#444444',
};

function getTheme(theme?: 'light' | 'dark') {
  return theme === 'dark' ? darkTheme : lightTheme;
}

export interface UpSetStyleProps extends UpSetThemeProps {
  theme?: 'light' | 'dark';
  triangleSize?: number;
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
   * @default 16px
   */
  fontSize?: string;
  /**
   * @default 10px
   */
  axisFontSize?: string;

  linearScaleFactory?: (domain: [number, number], range: [number, number]) => NumericScaleLike;
  bandScaleFactory?: (domain: string[], range: [number, number], padding: number) => BandScaleLike;

  setName?: string | React.ReactNode;
  combinationName?: string | React.ReactNode;
}

function linearScale(domain: [number, number], range: [number, number]): NumericScaleLike {
  return scaleLinear().domain(domain).range(range);
}

function bandScale(domain: string[], range: [number, number], padding: number): BandScaleLike {
  return scaleBand().domain(domain).range(range).padding(padding);
}

export type UpSetProps<T> = UpSetDataProps<T> &
  UpSetSizeProps &
  UpSetStyleProps &
  UpSetReactStyleProps &
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
  UpSetReactStyleProps &
  UpSetSelectionProps<T> {
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
      combinationNameAxisOffset: 30,
      setName: 'Set Size',
      triangleSize: 5,
      fontSize: '16px',
      axisFontSize: '10px',
      widthRatios: [0.2, 0.1, 0.7],
      heightRatios: [0.6, 0.4],
      queries: [],
      queryLegend: props.queries != null && props.queries.length > 0,
      exportButtons: true,
      linearScaleFactory: linearScale,
      bandScaleFactory: bandScale,
    },
    theme,
    props
  );
}
