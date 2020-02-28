import React, { PropsWithChildren } from 'react';
import { ExtraStyles } from '../theme';
import { ISet, generateSetIntersections, ISets, IIntersectionSet, IIntersectionSets } from '../data';
import { scaleLinear, scaleBand } from 'd3-scale';
import D3Axis from './D3Axis';

export type UpSetSizeProps = {
  width: number;
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
   * the intersections to visualize by default all intersections
   */
  intersections?: IIntersectionSets<T>;
};

export type UpSetSelectionProps<T> = {
  selection?: ISet<T> | IIntersectionSet<T> | null;
  onMouseEnter?(selection: ISet<T> | IIntersectionSet<T>): void;
  onMouseLeave?(selection: ISet<T> | IIntersectionSet<T>): void;
  onClick?(selection: ISet<T> | IIntersectionSet<T>): void;
};

export type UpSetStyleProps = {
  setName?: string | React.ReactNode;
  intersectionName?: string | React.ReactNode;
  selectionColor?: string;
  alternatingBackgroundColor?: string;
  color?: string;
  notMemberColor?: string;
  labelStyle?: React.CSSProperties;
  setLabelStyle?: React.CSSProperties;
  setNameStyle?: React.CSSProperties;
  axisStyle?: React.CSSProperties;
  intersectionNameStyle?: React.CSSProperties;
};

export type UpSetProps<T> = UpSetDataProps<T> & UpSetSizeProps & UpSetStyleProps & ExtraStyles;

function defineStyle(size: {
  width: number;
  height: number;
  margin: number;
  barPadding: number;
  widthRatios: [number, number, number];
  heightRatios: [number, number];
}) {
  return {
    intersections: {
      w: (size.width - 2 * size.margin) * size.widthRatios[2],
      h: (size.height - 2 * size.margin - 20) * size.heightRatios[0],
    },
    labels: { w: (size.width - 2 * size.margin) * size.widthRatios[1] },
    sets: {
      w: (size.width - 2 * size.margin) * size.widthRatios[0],
      h: (size.height - 2 * size.margin - 20) * size.heightRatios[1],
    },
    padding: size.barPadding,
  };
}

declare type UpSetStyles = ReturnType<typeof defineStyle>;

declare type UpSetSelection = {
  onMouseEnter(selection: ISet<any> | IIntersectionSet<any>): (() => void) | undefined;
  onMouseLeave(selection: ISet<any> | IIntersectionSet<any>): (() => void) | undefined;
  onClick(selection: ISet<any> | IIntersectionSet<any>): (() => void) | undefined;
};

function generateScales(sets: ISets<any>, intersections: IIntersectionSets<any>, styles: UpSetStyles) {
  return {
    sets: {
      x: scaleLinear()
        .domain([0, sets.reduce((acc, d) => Math.max(acc, d.cardinality), 0)])
        .range([styles.sets.w, 0]),
      y: scaleBand()
        .domain(sets.map(d => d.name))
        .range([0, styles.sets.h])
        .padding(styles.padding),
    },
    intersections: {
      x: scaleBand()
        .domain(intersections.map(d => d.name))
        .range([0, styles.intersections.w])
        .padding(styles.padding),
      y: scaleLinear()
        .domain([0, intersections.reduce((acc, d) => Math.max(acc, d.cardinality), 0)])
        .range([styles.intersections.h, 0]),
    },
  };
}

declare type UpSetScales = ReturnType<typeof generateScales>;

const SetChart = React.memo(function SetChart<T>({
  sets,
  scales,
  onMouseEnter,
  onMouseLeave,
  onClick,
  color,
  labelStyle,
}: PropsWithChildren<
  {
    sets: ISets<T>;
    scales: UpSetScales;
    color: string;
    labelStyle?: React.CSSProperties;
  } & UpSetSelection
>) {
  const width = scales.sets.x.range()[0];
  const height = scales.sets.y.bandwidth();
  return (
    <g>
      {sets.map(d => {
        const x = scales.sets.x(d.cardinality);
        return (
          <g
            key={d.name}
            transform={`translate(0, ${scales.sets.y(d.name)})`}
            onMouseEnter={onMouseEnter(d)}
            onMouseLeave={onMouseLeave(d)}
            onClick={onClick(d)}
          >
            <title>
              {d.name}: {d.cardinality}
            </title>
            <rect x={x} width={width - x} height={height} style={{ fill: color }} />
            <text
              x={x}
              dx={-1}
              y={height / 2}
              style={{ textAnchor: 'end', dominantBaseline: 'central', fontSize: 'small', ...(labelStyle ?? {}) }}
            >
              {d.cardinality}
            </text>
          </g>
        );
      })}
    </g>
  );
});

function SetSelectionChart<T>({
  sets,
  scales,
  elemOverlap,
  color,
}: PropsWithChildren<{
  sets: ISets<T>;
  scales: UpSetScales;
  elemOverlap: (s: ISet<any>) => number;
  color: string;
}>) {
  const width = scales.sets.x.range()[0];
  const height = scales.sets.y.bandwidth();
  return (
    <g>
      {sets.map(d => {
        const sel = scales.sets.x(elemOverlap(d));
        return (
          sel < width && (
            <rect
              key={d.name}
              x={sel}
              y={scales.sets.y(d.name)}
              width={width - sel}
              height={height}
              style={{ fill: color, pointerEvents: 'none' }}
            />
          )
        );
      })}
    </g>
  );
}

const IntersectionChart = React.memo(function IntersectionChart<T>({
  intersections,
  scales,
  onClick,
  onMouseEnter,
  onMouseLeave,
  labelStyle,
  color,
}: PropsWithChildren<
  {
    intersections: IIntersectionSets<T>;
    scales: UpSetScales;
    color: string;
    labelStyle?: React.CSSProperties;
  } & UpSetSelection
>) {
  const width = scales.intersections.x.bandwidth();
  const height = scales.intersections.y.range()[0];
  return (
    <g>
      {intersections.map(d => {
        const y = scales.intersections.y(d.cardinality);
        return (
          <g
            key={d.name}
            transform={`translate(${scales.intersections.x(d.name)}, 0)`}
            onMouseEnter={onMouseEnter(d)}
            onMouseLeave={onMouseLeave(d)}
            onClick={onClick(d)}
          >
            <title>
              {d.name}: {d.cardinality}
            </title>
            <rect y={y} height={height - y} width={width} style={{ fill: color }} />
            <text
              y={y}
              dy={-1}
              x={width / 2}
              style={{ textAnchor: 'middle', fontSize: 'small', ...(labelStyle ?? {}) }}
            >
              {d.cardinality}
            </text>
          </g>
        );
      })}
    </g>
  );
});

function IntersectionSelectionChart<T>({
  intersections,
  scales,
  elemOverlap,
  color,
}: PropsWithChildren<{
  intersections: IIntersectionSets<T>;
  scales: UpSetScales;
  elemOverlap: (s: ISet<any> | IIntersectionSet<T>) => number;
  color: string;
}>) {
  const width = scales.intersections.x.bandwidth();
  const height = scales.intersections.y.range()[0];
  return (
    <g>
      {intersections.map(d => {
        const sel = scales.intersections.y(elemOverlap(d));
        return (
          sel < height && (
            <rect
              key={d.name}
              x={scales.intersections.x(d.name)}
              y={sel}
              height={height - sel}
              width={width}
              style={{ fill: color, pointerEvents: 'none' }}
            />
          )
        );
      })}
    </g>
  );
}

const UpSetLabel = React.memo(function UpSetLabel<T>({
  d,
  i,
  scales,
  styles,
  onClick,
  onMouseEnter,
  onMouseLeave,
  alternatingBackgroundColor,
  setLabelStyle,
}: PropsWithChildren<
  {
    d: ISet<T>;
    i: number;
    scales: UpSetScales;
    styles: UpSetStyles;
    alternatingBackgroundColor: string;
    setLabelStyle?: React.CSSProperties;
  } & UpSetSelection
>) {
  return (
    <g
      transform={`translate(0, ${scales.sets.y(d.name)})`}
      onMouseEnter={onMouseEnter(d)}
      onMouseLeave={onMouseLeave(d)}
      onClick={onClick(d)}
    >
      <rect
        width={styles.labels.w + styles.intersections.w}
        height={scales.sets.y.bandwidth()}
        style={{ fill: i % 2 === 1 ? alternatingBackgroundColor : 'transparent' }}
      />
      <text
        x={styles.labels.w / 2}
        y={scales.sets.y.bandwidth() / 2}
        style={{ textAnchor: 'middle', dominantBaseline: 'central', ...(setLabelStyle ?? {}) }}
      >
        {d.name}
      </text>
    </g>
  );
});

const Labels = React.memo(function Labels<T>({
  sets,
  scales,
  styles,
  onClick,
  onMouseEnter,
  onMouseLeave,
  alternatingBackgroundColor,
  setLabelStyle,
}: PropsWithChildren<
  {
    sets: ISets<T>;
    scales: UpSetScales;
    styles: UpSetStyles;
    alternatingBackgroundColor: string;
    setLabelStyle?: React.CSSProperties;
  } & UpSetSelection
>) {
  return (
    <g>
      {sets.map((d, i) => (
        <UpSetLabel
          key={d.name}
          d={d}
          i={i}
          scales={scales}
          styles={styles}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          alternatingBackgroundColor={alternatingBackgroundColor}
          setLabelStyle={setLabelStyle}
        />
      ))}
    </g>
  );
});

function LabelsSelection<T>({
  scales,
  styles,
  selection,
  selectionColor,
}: PropsWithChildren<{
  scales: UpSetScales;
  styles: UpSetStyles;
  selection: ISet<T> | IIntersectionSet<T> | null;
  selectionColor: string;
}>) {
  if (!selection || selection.type !== 'set') {
    return null;
  }
  const d = selection;
  return (
    <rect
      y={scales.sets.y(d.name)}
      width={styles.labels.w + styles.intersections.w}
      height={scales.sets.y.bandwidth()}
      style={{ stroke: selectionColor, fill: 'none', pointerEvents: 'none' }}
    />
  );
}

const UpSetDot = React.memo(function UpSetDot({
  cx,
  r,
  cy,
  name,
  color,
  interactive = true,
}: PropsWithChildren<{ r: number; cx: number; cy: number; color: string; name: string; interactive?: boolean }>) {
  return (
    <circle r={r} cx={cx} cy={cy} style={{ fill: color, pointerEvents: interactive ? undefined : 'none' }}>
      <title>{name}</title>
    </circle>
  );
});

const UpSetLine = React.memo(function UpSetLine<T>({
  d,
  sets,
  rsets,
  cx,
  r,
  cy,
  scales,
  height,
  color,
  notMemberColor,
  onClick,
  onMouseEnter,
  onMouseLeave,
}: PropsWithChildren<
  {
    sets: ISets<T>;
    scales: UpSetScales;
    height: number;
    rsets: ISets<T>;
    d: IIntersectionSet<T>;
    r: number;
    cx: number;
    cy: number;
    notMemberColor: string;
    color: string;
  } & UpSetSelection
>) {
  const width = cx * 2;
  return (
    <g
      transform={`translate(${scales.intersections.x(d.name)}, 0)`}
      onMouseEnter={onMouseEnter(d)}
      onMouseLeave={onMouseLeave(d)}
      onClick={onClick(d)}
    >
      <title>{d.name}</title>
      <rect width={width} height={height} style={{ fill: 'transparent' }} />
      <g>
        {sets.map(s => (
          <UpSetDot
            key={s.name}
            r={r}
            cx={cx}
            cy={scales.sets.y(s.name)! + cy}
            name={d.sets.has(s) ? s.name : d.name}
            color={d.sets.has(s) ? color : notMemberColor}
          />
        ))}
      </g>
      {d.sets.size > 1 && (
        <line
          x1={cx}
          y1={scales.sets.y(sets.find(p => d.sets.has(p))!.name)! + cy}
          x2={cx}
          y2={scales.sets.y(rsets.find(p => d.sets.has(p))!.name)! + cy}
          style={{ stroke: color, strokeWidth: r * 0.6, pointerEvents: 'none' }}
        />
      )}
    </g>
  );
});

const UpSetChart = React.memo(function UpSetChart<T>({
  sets,
  intersections,
  scales,
  styles,
  onClick,
  onMouseEnter,
  onMouseLeave,
  color,
  notMemberColor,
}: PropsWithChildren<
  {
    sets: ISets<T>;
    intersections: IIntersectionSets<T>;
    scales: UpSetScales;
    styles: UpSetStyles;
    color: string;
    notMemberColor: string;
  } & UpSetSelection
>) {
  const cy = scales.sets.y.bandwidth() / 2;
  const width = scales.intersections.x.bandwidth();
  const cx = width / 2;
  const r = Math.min(cx, cy) * (1 - styles.padding);
  const height = scales.sets.y.range()[1];
  const rsets = sets.slice().reverse();

  return (
    <g transform={`translate(${styles.labels.w}, 0)`}>
      {intersections.map(d => (
        <UpSetLine
          key={d.name}
          d={d}
          sets={sets}
          rsets={rsets}
          cx={cx}
          cy={cy}
          height={height}
          scales={scales}
          r={r}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          color={color}
          notMemberColor={notMemberColor}
        />
      ))}
    </g>
  );
});

function UpSetSelectionChart<T>({
  sets,
  scales,
  styles,
  selection,
  selectionColor,
  notMemberColor,
}: PropsWithChildren<{
  sets: ISets<T>;
  scales: UpSetScales;
  styles: UpSetStyles;
  selection: ISet<T> | IIntersectionSet<T> | null;
  selectionColor: string;
  notMemberColor: string;
}>) {
  const cy = scales.sets.y.bandwidth() / 2;
  const cx = scales.intersections.x.bandwidth() / 2;
  const r = Math.min(cx, cy) * (1 - styles.padding);
  const height = scales.sets.y.range()[1];
  const rsets = sets.slice().reverse();
  const width = scales.intersections.x.bandwidth();

  if (!selection || selection.type !== 'intersection') {
    return null;
  }
  const d = selection;
  return (
    <g transform={`translate(${styles.labels.w + scales.intersections.x(d.name)!}, 0)`}>
      <rect width={width} height={height} style={{ stroke: 'orange', pointerEvents: 'none', fill: 'none' }} />
      {sets.map(s => {
        const has = d.sets.has(s);
        return (
          <UpSetDot
            key={s.name}
            r={r}
            cx={cx}
            cy={scales.sets.y(s.name)! + cy}
            name={has ? s.name : d.name}
            color={has ? selectionColor : notMemberColor}
            interactive={false}
          />
        );
      })}
      {d.sets.size > 1 && (
        <line
          x1={cx}
          y1={scales.sets.y(sets.find(p => d.sets.has(p))!.name)! + cy}
          x2={cx}
          y2={scales.sets.y(rsets.find(p => d.sets.has(p))!.name)! + cy}
          style={{ stroke: selectionColor, strokeWidth: r * 0.6, pointerEvents: 'none' }}
        />
      )}
    </g>
  );
}

function noop() {
  return undefined;
}

function wrap<T>(f?: (set: ISet<T> | IIntersectionSet<T>) => void) {
  if (!f) {
    return noop;
  }
  return (set: ISet<T> | IIntersectionSet<T>) => {
    return function(this: any) {
      return f.call(this, set);
    };
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
  intersections = generateSetIntersections(sets),
  selection = null,
  onClick,
  onMouseEnter,
  onMouseLeave,
  intersectionName = 'Intersection Size',
  setName = 'Set Size',
  selectionColor = 'orange',
  color = 'black',
  notMemberColor = 'lightgray',
  alternatingBackgroundColor = '#eee',
  labelStyle,
  setLabelStyle,
  intersectionNameStyle = {},
  setNameStyle = {},
  axisStyle,
  widthRatios = [0.25, 0.1, 0.6],
  heightRatios = [0.6, 0.4],
}: PropsWithChildren<UpSetProps<T> & UpSetSelectionProps<T>>) {
  const styles = React.useMemo(() => defineStyle({ width, height, margin, barPadding, widthRatios, heightRatios }), [
    width,
    height,
    margin,
    barPadding,
    widthRatios,
    heightRatios,
  ]);
  const scales = React.useMemo(() => generateScales(sets, intersections, styles), [sets, intersections, styles]);

  // const [selection, setSelection] = useState(null as ISet<T> | null);
  const onClickImpl = wrap(onClick);
  const onMouseEnterImpl = wrap(onMouseEnter);
  const onMouseLeaveImpl = wrap(onMouseLeave);

  const selectedElems = new Set(selection == null ? [] : selection.elems);
  const elemOverlap = (s: ISet<T> | IIntersectionSet<T>) => {
    if (selection == null) {
      return 0;
    }
    if (s === selection) {
      return s.cardinality;
    }
    return s.elems.reduce((acc, e) => acc + (selectedElems.has(e) ? 1 : 0), 0);
  };

  return (
    <svg className={className} style={style} width={width} height={height}>
      <g transform={`translate(${margin},${margin})`}>
        <g transform={`translate(${styles.sets.w + styles.labels.w},0)`}>
          <IntersectionChart
            scales={scales}
            intersections={intersections}
            onClick={onClickImpl}
            onMouseEnter={onMouseEnterImpl}
            onMouseLeave={onMouseLeaveImpl}
            labelStyle={labelStyle}
            color={color}
          />
          <IntersectionSelectionChart
            scales={scales}
            intersections={intersections}
            elemOverlap={elemOverlap}
            color={selectionColor}
          />
          <D3Axis d3Scale={scales.intersections.y} orient="left" style={axisStyle} />
          <line
            x1={0}
            x2={styles.intersections.w}
            y1={styles.intersections.h + 1}
            y2={styles.intersections.h + 1}
            style={{ stroke: 'black' }}
          />
          <text
            style={{ textAnchor: 'middle', ...intersectionNameStyle }}
            transform={`translate(${-30}, ${styles.intersections.h / 2})rotate(-90)`}
          >
            {intersectionName}
          </text>
        </g>
        <g transform={`translate(0,${styles.intersections.h})`}>
          <SetChart
            scales={scales}
            sets={sets}
            onClick={onClickImpl}
            onMouseEnter={onMouseEnterImpl}
            onMouseLeave={onMouseLeaveImpl}
            labelStyle={labelStyle}
            color={color}
          />
          <SetSelectionChart scales={scales} sets={sets} elemOverlap={elemOverlap} color={selectionColor} />
          <D3Axis
            d3Scale={scales.sets.x}
            orient="bottom"
            transform={`translate(0, ${styles.sets.h})`}
            style={axisStyle}
          />
          <text
            style={{ textAnchor: 'middle', ...setNameStyle }}
            transform={`translate(${styles.sets.w / 2}, ${styles.sets.h + 30})`}
          >
            {setName}
          </text>
        </g>
        <g transform={`translate(${styles.sets.w},${styles.intersections.h})`}>
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
            intersections={intersections}
            onClick={onClickImpl}
            onMouseEnter={onMouseEnterImpl}
            onMouseLeave={onMouseLeaveImpl}
            color={color}
            notMemberColor={notMemberColor}
          />
          <LabelsSelection scales={scales} styles={styles} selection={selection} selectionColor={selectionColor} />
          <UpSetSelectionChart
            scales={scales}
            sets={sets}
            styles={styles}
            selection={selection}
            selectionColor={selectionColor}
            notMemberColor={notMemberColor}
          />
        </g>
      </g>
      {children}
    </svg>
  );
}

export function InteractiveUpSet<T>(props: PropsWithChildren<UpSetProps<T>>) {
  const [selection, setSelection] = React.useState(null as ISet<any> | IIntersectionSet<T> | null);
  return <UpSet selection={selection} onMouseEnter={setSelection} onMouseLeave={() => setSelection(null)} {...props} />;
}
