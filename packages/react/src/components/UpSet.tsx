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

export type UpSetSizeProps = {
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

  /**
   * legend width
   * @default 150
   */
  queryLegendWidth?: number;
};

export type UpSetDataProps<T> = {
  /**
   * the sets to visualize
   */
  sets: ISets<T>;
  /**
   * the combinations to visualize by default all combinations
   */
  combinations?: ISetCombinations<T> | GenerateSetCombinationsOptions;
};

export type UpSetSelectionProps<T> = {
  selection?: ISetLike<T> | null | ReadonlyArray<T>;
  onHover?(selection: ISetLike<T> | null): void;
  onClick?(selection: ISetLike<T> | null): void;

  queries?: ReadonlyArray<UpSetQuery<T>>;
};

export type UpSetReactStyleProps = {
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
};

export type UpSetStyleProps = {
  selectionColor?: string;
  alternatingBackgroundColor?: string;
  color?: string;
  notMemberColor?: string;
  triangleSize?: number;
  /**
   * show a legend of queries
   * enabled by default when queries are set
   */
  queryLegend?: boolean;

  linearScaleFactory?: (domain: [number, number], range: [number, number]) => NumericScaleLike;
  bandScaleFactory?: (domain: string[], range: [number, number], padding: number) => BandScaleLike;
};

function linearScale(domain: [number, number], range: [number, number]): NumericScaleLike {
  return scaleLinear().domain(domain).range(range);
}

function bandScale(domain: string[], range: [number, number], padding: number): BandScaleLike {
  return scaleBand().domain(domain).range(range).padding(padding);
}

export type UpSetProps<T> = UpSetDataProps<T> & UpSetSizeProps & UpSetStyleProps & UpSetReactStyleProps;

function areCombinations<T>(
  combinations: ISetCombinations<T> | GenerateSetCombinationsOptions
): combinations is ISetCombinations<T> {
  return Array.isArray(combinations);
}

export default function UpSet<T>({
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
  combinationName = 'Intersection Size',
  combinationNameAxisOffset = 30,
  setName = 'Set Size',
  selectionColor = 'orange',
  color = 'black',
  notMemberColor = 'lightgray',
  alternatingBackgroundColor = '#f5f5f5',
  triangleSize = 5,
  labelStyle,
  setLabelStyle,
  combinationNameStyle = {},
  setNameStyle = {},
  axisStyle,
  widthRatios = [0.25, 0.1, 0.65],
  heightRatios = [0.6, 0.4],
  queries = [],
  queryLegend = queries.length > 0,
  queryLegendWidth = 150,
  linearScaleFactory = linearScale,
  bandScaleFactory = bandScale,
}: PropsWithChildren<UpSetProps<T> & UpSetSelectionProps<T>>) {
  const ref = React.useRef(null as SVGSVGElement | null);

  const cs = areCombinations(combinations) ? combinations : generateCombinations(sets, combinations);
  const styles = React.useMemo(
    () => defineStyle({ width, height, margin, barPadding, widthRatios, heightRatios, queryLegendWidth }),
    [width, height, margin, barPadding, widthRatios, heightRatios, queryLegendWidth]
  );
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
    font-size: 10px;
    font-family: sans-serif;
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
    stroke: black;
  }
  .clickAble {
    cursor: pointer;
  }

  .interactive:hover > rect {
    // filter: drop-shadow(0 0 2px #cccccc);
    stroke: #cccccc;
  }

  .exportButtons {
    dominant-baseline: hanging;
    text-anchor: end;
    font-size: 10px;
  }
  .exportButton {
    cursor: pointer;
  }
  .exportButton:hover {
    font-weight: bold;
  }
  `;

  return (
    <svg className={className} style={style} width={width} height={height} ref={ref}>
      <style>{rules}</style>
      {queryLegend && <QueryLegend queries={queries} transform={`translate(${styles.legend.x},0)`} />}
      <ExportButtons transform={`translate(${styles.w - 2},2)`} />
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
}
