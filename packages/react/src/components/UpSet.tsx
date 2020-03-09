import { generateIntersections, ISetLike, ISets, ISetCombinations, setOverlapFactory } from '@upsetjs/model';
import React, { PropsWithChildren } from 'react';
import { ExtraStyles } from '../theme';
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
import { UpSetQuery, isElemQuery, isSetQuery } from './upset/queries';
import QueryLegend from './upset/QueryLegend';

export type { UpSetCalcQuery, UpSetElemQuery, UpSetQuery, UpSetSetQuery } from './upset/queries';

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
};

export type UpSetDataProps<T> = {
  /**
   * the sets to visualize
   */
  sets: ISets<T>;
  /**
   * the combinations to visualize by default all combinations
   */
  combinations?: ISetCombinations<T>;
};

export type UpSetSelectionProps<T> = {
  selection?: ISetLike<T> | null;
  onHover?(selection: ISetLike<T> | null): void;
  onClick?(selection: ISetLike<T>): void;

  queries?: ReadonlyArray<UpSetQuery<T>>;
};

export type UpSetStyleProps = {
  setName?: string | React.ReactNode;
  combinationName?: string | React.ReactNode;
  selectionColor?: string;
  alternatingBackgroundColor?: string;
  color?: string;
  notMemberColor?: string;
  labelStyle?: React.CSSProperties;
  setLabelStyle?: React.CSSProperties;
  setNameStyle?: React.CSSProperties;
  axisStyle?: React.CSSProperties;
  combinationNameStyle?: React.CSSProperties;
  triangleSize?: number;
  queryLegend?: boolean;
};

export type UpSetProps<T> = UpSetDataProps<T> & UpSetSizeProps & UpSetStyleProps & ExtraStyles;

function noop() {
  return undefined;
}

function wrap<T>(f?: (set: ISetLike<T>) => void) {
  if (!f) {
    return noop;
  }
  return (set: ISetLike<T>) => {
    return function(this: any) {
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

export default function UpSet<T>({
  className,
  style,
  children,
  width,
  height,
  padding: margin = 20,
  barPadding = 0.3,
  sets,
  combinations = generateIntersections(sets),
  selection = null,
  onClick,
  onHover,
  combinationName = 'Intersection Size',
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
  queryLegend
}: PropsWithChildren<UpSetProps<T> & UpSetSelectionProps<T>>) {
  const styles = React.useMemo(() => defineStyle({ width, height, margin, barPadding, widthRatios, heightRatios }), [
    width,
    height,
    margin,
    barPadding,
    widthRatios,
    heightRatios,
  ]);
  const scales = React.useMemo(() => generateScales(sets, combinations, styles), [sets, combinations, styles]);
  const qs = React.useMemo(
    () =>
      queries.map(q => ({
        ...q,
        overlap: isElemQuery(q) ? elemOverlapOf(q.elems) : isSetQuery(q) ? elemOverlapOf(q.set.elems) : q.overlap,
      })),
    [queries]
  );

  // const [selection, setSelection] = useState(null as ISet<T> | null);
  const onClickImpl = wrap(onClick);
  const onMouseEnterImpl = wrap(onHover);
  const onMouseLeaveImpl = wrap(onHover ? () => onHover(null) : undefined);

  const elemOverlap = selection ? elemOverlapOf(selection.elems) : () => 0;

  return (
    <svg className={className} style={style} width={width} height={height}>
      <g transform={`translate(${margin},${margin})`}>
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
            transform={`translate(${-30}, ${styles.combinations.h / 2})rotate(-90)`}
          >
            {combinationName}
          </text>
          <CombinationChart
            scales={scales}
            combinations={combinations}
            onClick={onClickImpl}
            onMouseEnter={onMouseEnterImpl}
            onMouseLeave={onMouseLeaveImpl}
            labelStyle={labelStyle}
            color={color}
          />
          <g>
            {selection && (
              <CombinationSelectionChart
                scales={scales}
                combinations={combinations}
                elemOverlap={elemOverlap}
                color={selectionColor}
                triangleSize={triangleSize}
                tooltip={onHover ? undefined : selection.name}
              />
            )}
            {qs.map((q, i) => (
              <CombinationSelectionChart
                key={q.name}
                scales={scales}
                combinations={combinations}
                elemOverlap={q.overlap}
                color={q.color}
                secondary={selection != null || i > 0}
                triangleSize={triangleSize}
                tooltip={onHover && !(selection != null || i > 0) ? undefined : q.name}
              />
            ))}
          </g>
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
          <SetChart
            scales={scales}
            sets={sets}
            onClick={onClickImpl}
            onMouseEnter={onMouseEnterImpl}
            onMouseLeave={onMouseLeaveImpl}
            labelStyle={labelStyle}
            color={color}
          />
          <g>
            {selection && (
              <SetSelectionChart
                scales={scales}
                sets={sets}
                elemOverlap={elemOverlap}
                color={selectionColor}
                triangleSize={triangleSize}
                tooltip={onHover ? undefined : selection.name}
              />
            )}
            {qs.map((q, i) => (
              <SetSelectionChart
                key={q.name}
                scales={scales}
                sets={sets}
                elemOverlap={q.overlap}
                color={q.color}
                secondary={selection != null || i > 0}
                triangleSize={triangleSize}
                tooltip={onHover && !(selection != null || i > 0) ? undefined : q.name}
              />
            ))}
          </g>
        </g>
        <g transform={`translate(${styles.sets.w},${styles.combinations.h})`}>
          <Labels
            scales={scales}
            sets={sets}
            styles={styles}
            onClick={onClickImpl}
            onMouseEnter={onMouseEnterImpl}
            onMouseLeave={onMouseLeaveImpl}
            alternatingBackgroundColor={alternatingBackgroundColor}
            setLabelStyle={setLabelStyle}
          />
          <UpSetChart
            scales={scales}
            sets={sets}
            styles={styles}
            combinations={combinations}
            onClick={onClickImpl}
            onMouseEnter={onMouseEnterImpl}
            onMouseLeave={onMouseLeaveImpl}
            color={color}
            notMemberColor={notMemberColor}
          />
          {selection && (
            <LabelsSelection scales={scales} styles={styles} selection={selection} selectionColor={selectionColor} />
          )}
          {selection && (
            <UpSetSelectionChart
              scales={scales}
              sets={sets}
              styles={styles}
              selection={selection}
              selectionColor={selectionColor}
              notMemberColor={notMemberColor}
            />
          )}
        </g>
      </g>
      {queryLegend && <QueryLegend queries={queries} />}
      {children}
    </svg>
  );
}
