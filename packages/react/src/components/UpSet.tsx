import {
  GenerateSetCombinationsOptions,
  generateCombinations,
  ISetLike,
  ISets,
  ISetCombinations,
  NumericScaleLike,
  BandScaleLike,
  UpSetQuery,
  queryOverlap,
  setOverlapFactory,
} from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import D3Axis from './D3Axis';
import defineStyle from './upset/defineStyle';
import generateScales from './upset/generateScales';
import CombinationChart from './upset/CombinationChart';
import CombinationSelectionChart from './upset/CombinationSelectionChart';
import Labels from './upset/Labels';
import LabelsSelection from './upset/LabelsSelection';
import SetChart from './upset/SetChart';
import SetSelectionChart from './upset/SetSelectionChart';
import UpSetChart from './upset/UpSetChart';
import UpSetSelectionChart from './upset/UpSetSelectionChart';
import QueryLegend from './upset/QueryLegend';
import { scaleBand, scaleLinear } from 'd3-scale';

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
   * @default 20
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
  onClick?(selection: ISetLike<T>): void;

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

function noop() {
  return undefined;
}

function wrap<T>(f?: (set: ISetLike<T>) => void) {
  if (!f) {
    return noop;
  }
  return (set: ISetLike<T>) => {
    return function (this: any) {
      return f.call(this, set);
    };
  };
}

function elemOverlapOf<T>(query: Set<T> | ReadonlyArray<T>) {
  const f = setOverlapFactory(query);
  return (s: ISetLike<T>) => {
    return f(s.elems).intersection;
  };
}

function areCombinations<T>(
  combinations: ISetCombinations<T> | GenerateSetCombinationsOptions
): combinations is ISetCombinations<T> {
  return Array.isArray(combinations);
}

function isSetLike<T>(s: ReadonlyArray<T> | ISetLike<T> | null): s is ISetLike<T> {
  return s != null && !Array.isArray(s);
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
  widthRatios = [0.25, 0.1, 0.6],
  heightRatios = [0.6, 0.4],
  queries = [],
  queryLegend = queries.length > 0,
  queryLegendWidth = 150,
  linearScaleFactory = linearScale,
  bandScaleFactory = bandScale,
}: PropsWithChildren<UpSetProps<T> & UpSetSelectionProps<T>>) {
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
  const qs = React.useMemo(
    () =>
      queries.map((q) => ({
        ...q,
        overlap: queryOverlap(q, 'intersection'),
      })),
    [queries]
  );

  // const [selection, setSelection] = useState(null as ISet<T> | null);
  const onClickImpl = wrap(onClick);
  const onMouseEnterImpl = wrap(onHover);
  const onMouseLeaveImpl = wrap(onHover ? () => onHover(null) : undefined);

  const selectionOverlap = selection
    ? elemOverlapOf(Array.isArray(selection) ? selection : (selection as ISetLike<T>).elems)
    : () => 0;
  const selectionName = Array.isArray(selection) ? `Array(${selection.length})` : (selection as ISetLike<T>)?.name;

  const clickStyle: React.CSSProperties = {};
  if (onClick) {
    clickStyle.cursor = 'pointer';
  }

  const r = (Math.min(scales.sets.y.bandwidth(), scales.combinations.x.bandwidth()) / 2) * (1 - styles.padding);

  const rules = `
  .barLabel {
    font-size: 10px;
  }
  .middleText {
    text-anchor: middle;
  }
  .sBarLabel {
    text-anchor: end;
    dominant-baseline: central;
  }
  .labelBGOdd {
    fill: ${alternatingBackgroundColor};
  }
  .labelText {
    text-anchor: middle;
    dominant-baseline: central;
  }
  .labelSelection {
    fill: none;
    pointer-events: none;
  }
  .legendText {
    font-size: 10px;
    dominant-baseline: central;
  }
  .uBG {
    fill: transparent;
  }
  .uLine {
    stroke-width: ${r * 0.6};
    pointer-events: none;
  }
  .pnone {
    pointer-events: none;
  }
  .qB { fill: ${color}; }
  .qS { fill: ${selectionColor}; }
  .qM { fill: ${notMemberColor}; }
  .qO { fill: ${alternatingBackgroundColor}; }
  .qN { fill: none; }
  .qT { fill: transparent; }
  .sS { stroke: ${selectionColor}; }
  ${queries.map((q, i) => `.q${i} { fill: ${q.color}; }`).join('\n')}
  `;

  return (
    <svg className={className} style={style} width={width} height={height}>
      <style>{rules}</style>
      {queryLegend && <QueryLegend queries={queries} transform={`translate(${styles.legend.x},0)`} />}
      <g transform={`translate(${margin},${margin})`}>
        {/* axis */}
        <g>
          <g transform={`translate(${styles.sets.w + styles.labels.w},0)`}>
            <D3Axis d3Scale={scales.combinations.y} orient="left" style={axisStyle} integersOnly />
            <line
              x1={0}
              x2={styles.combinations.w}
              y1={styles.combinations.h + 1}
              y2={styles.combinations.h + 1}
              style={{ stroke: 'black' }}
            />
            <text
              style={{ textAnchor: 'middle', ...combinationNameStyle }}
              transform={`translate(${-combinationNameAxisOffset}, ${styles.combinations.h / 2})rotate(-90)`}
            >
              {combinationName}
            </text>
          </g>
          <g transform={`translate(0,${styles.combinations.h})`}>
            <D3Axis
              d3Scale={scales.sets.x}
              orient="bottom"
              transform={`translate(0, ${styles.sets.h})`}
              style={axisStyle}
              integersOnly
            />
            <text
              style={{ textAnchor: 'middle', ...setNameStyle }}
              transform={`translate(${styles.sets.w / 2}, ${styles.sets.h + 30})`}
            >
              {setName}
            </text>
          </g>
        </g>
        {/* chart */}
        <g style={clickStyle}>
          <g transform={`translate(${styles.sets.w + styles.labels.w},0)`}>
            <CombinationChart
              scales={scales}
              combinations={cs}
              onClick={onClickImpl}
              onMouseEnter={onMouseEnterImpl}
              onMouseLeave={onMouseLeaveImpl}
              labelStyle={labelStyle}
            />
          </g>
          <g transform={`translate(0,${styles.combinations.h})`}>
            <SetChart
              scales={scales}
              sets={sets}
              onClick={onClickImpl}
              onMouseEnter={onMouseEnterImpl}
              onMouseLeave={onMouseLeaveImpl}
              labelStyle={labelStyle}
            />
          </g>
          <g transform={`translate(${styles.sets.w},${styles.combinations.h})`}>
            <Labels
              scales={scales}
              sets={sets}
              styles={styles}
              onClick={onClickImpl}
              onMouseEnter={onMouseEnterImpl}
              onMouseLeave={onMouseLeaveImpl}
              setLabelStyle={setLabelStyle}
            />
            <UpSetChart
              scales={scales}
              sets={sets}
              styles={styles}
              combinations={cs}
              onClick={onClickImpl}
              onMouseEnter={onMouseEnterImpl}
              onMouseLeave={onMouseLeaveImpl}
            />
          </g>
        </g>
        {/* selection */}
        <g className={onHover ? 'pnone' : undefined}>
          <g transform={`translate(${styles.sets.w + styles.labels.w},0)`}>
            {selection && (
              <CombinationSelectionChart
                scales={scales}
                combinations={cs}
                elemOverlap={selectionOverlap}
                suffix="S"
                triangleSize={triangleSize}
                tooltip={onHover ? undefined : selectionName}
              />
            )}
            {qs.map((q, i) => (
              <CombinationSelectionChart
                key={q.name}
                scales={scales}
                combinations={cs}
                elemOverlap={q.overlap}
                suffix={`${i}`}
                secondary={selection != null || i > 0}
                triangleSize={triangleSize}
                tooltip={onHover && !(selection != null || i > 0) ? undefined : q.name}
              />
            ))}
          </g>
          <g transform={`translate(0,${styles.combinations.h})`}>
            {selection && (
              <SetSelectionChart
                scales={scales}
                sets={sets}
                elemOverlap={selectionOverlap}
                suffix="S"
                triangleSize={triangleSize}
                tooltip={onHover ? undefined : selectionName}
              />
            )}
            {qs.map((q, i) => (
              <SetSelectionChart
                key={q.name}
                scales={scales}
                sets={sets}
                elemOverlap={q.overlap}
                suffix={`${i}`}
                secondary={selection != null || i > 0}
                triangleSize={triangleSize}
                tooltip={onHover && !(selection != null || i > 0) ? undefined : q.name}
              />
            ))}
          </g>
          <g transform={`translate(${styles.sets.w},${styles.combinations.h})`}>
            {isSetLike(selection) && <LabelsSelection scales={scales} styles={styles} selection={selection} />}
            {isSetLike(selection) && (
              <UpSetSelectionChart scales={scales} sets={sets} styles={styles} selection={selection} />
            )}
          </g>
        </g>
      </g>
      {children}
    </svg>
  );
}
