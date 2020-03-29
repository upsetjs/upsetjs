import {
  GenerateSetCombinationsOptions,
  generateCombinations,
  ISetLike,
  ISets,
  ISetCombinations,
  NumericScaleLike,
  BandScaleLike,
  UpSetQuery,
} from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import defineStyle from './upset/defineStyle';
import generateScales from './upset/generateScales';
import UpSetAxis from './upset/UpSetAxis';
import UpSetQueries from './upset/UpSetQueries';
import UpSetSelection from './upset/UpSetSelection';
import UpSetChart from './upset/UpSetChart';
import QueryLegend from './upset/QueryLegend';
import { scaleBand, scaleLinear } from 'd3-scale';
import ExportButtons from './upset/ExportButtons';

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
  setName?: string | React.ReactNode;
  combinationName?: string | React.ReactNode;
  combinationNameAxisOffset?: number;
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
  fontSize: string;
  /**
   * @default 10px
   */
  axisFontSize: string;

  linearScaleFactory?: (domain: [number, number], range: [number, number]) => NumericScaleLike;
  bandScaleFactory?: (domain: string[], range: [number, number], padding: number) => BandScaleLike;
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

export default React.forwardRef(function UpSet<T>({
  className,
  style,
  children,
  width,
  height,
  padding: margin = 20,
  barPadding = 0.3,
  sets,
  combinations = { type: 'intersection' },
  selection = null,
  onClick,
  onHover,
  theme,
  combinationName = 'Intersection Size',
  combinationNameAxisOffset = 30,
  setName = 'Set Size',
  selectionColor = getTheme(theme).selectionColor,
  color = getTheme(theme).color,
  textColor = getTheme(theme).textColor,
  hoverHintColor = getTheme(theme).hoverHintColor,
  notMemberColor = getTheme(theme).notMemberColor,
  alternatingBackgroundColor = getTheme(theme).alternatingBackgroundColor,
  triangleSize = 5,
  labelStyle,
  fontSize = '16px',
  axisFontSize = '10px',
  setLabelStyle,
  combinationNameStyle = {},
  setNameStyle = {},
  axisStyle,
  widthRatios = [0.25, 0.1, 0.65],
  heightRatios = [0.6, 0.4],
  queries = [],
  queryLegend = queries.length > 0,
  exportButtons = true,
  linearScaleFactory = linearScale,
  bandScaleFactory = bandScale,
}: PropsWithChildren<UpSetProps<T>>) {
  const cs = areCombinations(combinations) ? combinations : generateCombinations(sets, combinations);
  const styles = React.useMemo(() => defineStyle({ width, height, margin, barPadding, widthRatios, heightRatios }), [
    width,
    height,
    margin,
    barPadding,
    widthRatios,
    heightRatios,
  ]);
  const scales = React.useMemo(() => generateScales(sets, cs, styles, linearScaleFactory, bandScaleFactory), [
    sets,
    cs,
    styles,
    linearScaleFactory,
    bandScaleFactory,
  ]);

  const r = (Math.min(scales.sets.y.bandwidth(), scales.combinations.x.bandwidth()) / 2) * (1 - styles.padding);

  const rules = `
  .labelStyle {
    font-size: ${axisFontSize};
    font-family: sans-serif;
    fill: ${textColor};
  }
  .nameStyle {
    font-size: ${fontSize};
  }
  .middleText {
    text-anchor: middle;
  }
  .startText {
    text-anchor: start;
  }
  .endText {
    text-anchor: end;
  }
  .centralText {
    dominant-baseline: central;
  }
  .upsetLine {
    stroke-width: ${r * 0.6};
  }
  .pnone {
    pointer-events: none;
  }
  .fillPrimary { fill: ${color}; }
  .fillSelection { fill: ${selectionColor}; }
  .fillNotMember { fill: ${notMemberColor}; }
  .fillAlternating { fill: ${alternatingBackgroundColor}; }
  .fillNone { fill: none; }
  .fillTransparent { fill: transparent; }
  ${queries.map((q, i) => `.fillQ${i} { fill: ${q.color}; }`).join('\n')}

  .strokePrimary { stroke: ${color}; }
  .strokeSelection { stroke: ${selectionColor}; }

  .strokeScaledSelection { stroke-width: ${r * 0.6 * 1.1}; }

  .axisLine {
    fill: none;
    stroke: ${textColor};
  }
  .clickAble {
    cursor: pointer;
  }

  .legend {
    text-anchor: middle;
    dominant-baseline: hanging;
    pointer-events: none;
  }

  .interactive:hover > rect {
    // filter: drop-shadow(0 0 2px #cccccc);
    stroke: ${hoverHintColor};
  }

  .exportButtons {
    text-anchor: middle;
    font-size: 10px;
  }
  .exportButton {
    cursor: pointer;
    opacity: 0.5;
  }
  .exportButton:hover {
    opacity: 1;
  }
  .exportButton > rect {
    fill: none;
    stroke: ${textColor};
  }
  .exportButton > text {
    fill: ${textColor};
  }
  `;

  return (
    <svg className={className} style={style} width={width} height={height}>
      <style>{rules}</style>
      {queryLegend && <QueryLegend queries={queries} transform={`translate(${styles.legend.x},2)`} />}
      {exportButtons && <ExportButtons transform={`translate(${styles.w - 2},${styles.h - 3})`} />}
      <g transform={`translate(${margin},${margin})`}>
        {onClick && (
          <rect
            width={styles.sets.w + styles.labels.w}
            height={styles.combinations.h}
            onClick={() => onClick(null)}
            className="fillTransparent"
          />
        )}
        <UpSetAxis
          combinationName={combinationName}
          combinationNameAxisOffset={combinationNameAxisOffset}
          scales={scales}
          setName={setName}
          styles={styles}
          axisStyle={axisStyle}
          combinationNameStyle={combinationNameStyle}
          setNameStyle={setNameStyle}
        />
        <UpSetChart
          cs={cs}
          r={r}
          scales={scales}
          sets={sets}
          styles={styles}
          labelStyle={labelStyle}
          onClick={onClick}
          onHover={onHover}
          setLabelStyle={setLabelStyle}
        />
        <UpSetQueries
          cs={cs}
          scales={scales}
          sets={sets}
          styles={styles}
          onHover={onHover}
          queries={queries}
          secondary={selection != null}
          triangleSize={triangleSize}
        />
        <UpSetSelection
          cs={cs}
          scales={scales}
          sets={sets}
          styles={styles}
          onHover={onHover}
          selection={selection}
          triangleSize={triangleSize}
        />
      </g>
      {children}
    </svg>
  );
});
