import React, { PropsWithChildren, useState } from 'react';
import { ExtraStyles } from '../theme';
import { ISet, generateSetIntersections, ISets } from '../data';
import { scaleLinear, scaleBand } from 'd3-scale';
import D3Axis from './D3Axis';

export type UpSetSizeProps = {
  width: number;
  height: number;
  margin?: number;
};

export type UpSetDataProps<T> = {
  sets: ReadonlyArray<ISet<T>>;
  intersections?: ReadonlyArray<ISet<T>>;
};

export type UpSetSelectionProps<T> = {
  selection?: ISet<T> | null;
  onSelectionChanged?(selection: ISet<T> | null): void;
};

export type UpSetStyleProps = {};

export type UpSetProps<T> = UpSetDataProps<T> & UpSetSizeProps & UpSetStyleProps & ExtraStyles;

function defineStyle(size: { width: number; height: number; margin: number }) {
  return {
    intersections: {
      w: (size.width - 2 * size.margin) * 0.65,
      h: (size.height - 2 * size.margin - 20) * 0.6,
    },
    sets: {
      w: (size.width - 2 * size.margin) * 0.25,
      h: (size.height - 2 * size.margin - 20) * 0.4,
    },
    labels: { w: (size.width - 2 * size.margin) * 0.1 },
    padding: 0.3,
  };
}

declare type UpSetStyles = ReturnType<typeof defineStyle>;

declare type UpSetSelection = {
  setSelection(s: ISet<any>): void;
  clearSelection(): void;
};

function generateScales(sets: ISets<any>, intersections: ISets<any>, styles: UpSetStyles) {
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
  setSelection,
  clearSelection,
}: PropsWithChildren<
  {
    sets: ISets<T>;
    scales: UpSetScales;
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
            onMouseEnter={() => setSelection(d)}
            onMouseLeave={clearSelection}
          >
            <title>
              {d.name}: {d.cardinality}
            </title>
            <rect x={x} width={width - x} height={height} />
            <text
              x={x}
              dx="-1"
              y={height / 2}
              style={{ textAnchor: 'end', dominantBaseline: 'central', fontSize: 'small' }}
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
}: PropsWithChildren<{
  sets: ISets<T>;
  scales: UpSetScales;
  elemOverlap: (s: ISet<any>) => number;
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
              style={{ fill: 'orange', pointerEvents: 'none' }}
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
  setSelection,
  clearSelection,
}: PropsWithChildren<
  {
    intersections: ISets<T>;
    scales: UpSetScales;
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
            onMouseEnter={() => setSelection(d)}
            onMouseLeave={clearSelection}
          >
            <title>
              {d.name}: {d.cardinality}
            </title>
            <rect y={y} height={height - y} width={width} />
            <text y={y} dy={-1} x={width / 2} style={{ textAnchor: 'middle', fontSize: 'small' }}>
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
}: PropsWithChildren<{
  intersections: ISets<T>;
  scales: UpSetScales;
  elemOverlap: (s: ISet<any>) => number;
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
              style={{ fill: 'orange', pointerEvents: 'none' }}
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
  setSelection,
  clearSelection,
}: PropsWithChildren<{ d: ISet<T>; i: number; scales: UpSetScales; styles: UpSetStyles } & UpSetSelection>) {
  return (
    <g
      transform={`translate(0, ${scales.sets.y(d.name)})`}
      onMouseEnter={() => setSelection(d)}
      onMouseLeave={clearSelection}
    >
      <rect
        width={styles.labels.w + styles.intersections.w}
        height={scales.sets.y.bandwidth()}
        style={{ fill: i % 2 === 1 ? '#eee' : 'transparent' }}
      />
      <text
        x={styles.labels.w / 2}
        y={scales.sets.y.bandwidth() / 2}
        style={{ textAnchor: 'middle', dominantBaseline: 'central' }}
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
  setSelection,
  clearSelection,
}: PropsWithChildren<{ sets: ISets<T>; scales: UpSetScales; styles: UpSetStyles } & UpSetSelection>) {
  return (
    <g>
      {sets.map((d, i) => (
        <UpSetLabel
          key={d.name}
          d={d}
          i={i}
          scales={scales}
          styles={styles}
          setSelection={setSelection}
          clearSelection={clearSelection}
        />
      ))}
    </g>
  );
});

function LabelsSelection<T>({
  scales,
  styles,
  selection,
}: PropsWithChildren<{ scales: UpSetScales; styles: UpSetStyles; selection: ISet<T> | null }>) {
  if (!selection || !selection.primary) {
    return null;
  }
  const d = selection;
  return (
    <rect
      y={scales.sets.y(d.name)}
      width={styles.labels.w + styles.intersections.w}
      height={scales.sets.y.bandwidth()}
      style={{ stroke: 'orange', fill: 'none', pointerEvents: 'none' }}
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
  setSelection,
  clearSelection,
}: PropsWithChildren<
  {
    sets: ISets<T>;
    scales: UpSetScales;
    height: number;
    rsets: ISets<T>;
    d: ISet<T>;
    r: number;
    cx: number;
    cy: number;
    color?: string;
  } & UpSetSelection
>) {
  const width = cx * 2;
  return (
    <g
      transform={`translate(${scales.intersections.x(d.name)}, 0)`}
      onMouseEnter={() => setSelection(d)}
      onMouseLeave={clearSelection}
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
            color={d.sets.has(s) ? 'black' : 'lightgray'}
          />
        ))}
      </g>
      {d.sets.size > 1 && (
        <line
          x1={cx}
          y1={scales.sets.y(sets.find(p => d.sets.has(p))!.name)! + cy}
          x2={cx}
          y2={scales.sets.y(rsets.find(p => d.sets.has(p))!.name)! + cy}
          style={{ stroke: 'black', strokeWidth: r * 0.6, pointerEvents: 'none' }}
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
  setSelection,
  clearSelection,
}: PropsWithChildren<
  { sets: ISets<T>; intersections: ISets<T>; scales: UpSetScales; styles: UpSetStyles } & UpSetSelection
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
          setSelection={setSelection}
          clearSelection={clearSelection}
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
}: PropsWithChildren<{
  sets: ISets<T>;
  scales: UpSetScales;
  styles: UpSetStyles;
  selection: ISet<T> | null;
}>) {
  const cy = scales.sets.y.bandwidth() / 2;
  const cx = scales.intersections.x.bandwidth() / 2;
  const r = Math.min(cx, cy) * (1 - styles.padding);
  const height = scales.sets.y.range()[1];
  const rsets = sets.slice().reverse();
  const width = scales.intersections.x.bandwidth();

  if (!selection || selection.primary) {
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
            color={has ? 'orange' : 'lightgray'}
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
          style={{ stroke: 'orange', strokeWidth: r * 0.6, pointerEvents: 'none' }}
        />
      )}
    </g>
  );
}

export default function UpSet<T>({
  className,
  style,
  children,
  width,
  height,
  margin = 20,
  sets,
  intersections = generateSetIntersections(sets),
  selection = null,
  onSelectionChanged,
}: PropsWithChildren<UpSetProps<T> & UpSetSelectionProps<T>>) {
  const styles = React.useMemo(() => defineStyle({ width, height, margin }), [width, height, margin]);
  const scales = React.useMemo(() => generateScales(sets, intersections, styles), [sets, intersections, styles]);

  // const [selection, setSelection] = useState(null as ISet<T> | null);
  const setSelection = onSelectionChanged ?? (() => undefined);
  const clearSelection = () => setSelection(null);

  const selectedElems = new Set(selection == null ? [] : selection.elems);
  const elemOverlap = (s: ISet<T>) => {
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
            setSelection={setSelection}
            clearSelection={clearSelection}
          />
          <IntersectionSelectionChart scales={scales} intersections={intersections} elemOverlap={elemOverlap} />
          <D3Axis d3Scale={scales.intersections.y} orient="left" />
          <line
            x1={0}
            x2={styles.intersections.w}
            y1={styles.intersections.h + 1}
            y2={styles.intersections.h + 1}
            style={{ stroke: 'black' }}
          />
          <text
            style={{ textAnchor: 'middle' }}
            transform={`translate(${-30}, ${styles.intersections.h / 2})rotate(-90)`}
          >
            Intersection Size
          </text>
        </g>
        <g transform={`translate(0,${styles.intersections.h})`}>
          <SetChart scales={scales} sets={sets} setSelection={setSelection} clearSelection={clearSelection} />
          <SetSelectionChart scales={scales} sets={sets} elemOverlap={elemOverlap} />
          <D3Axis d3Scale={scales.sets.x} orient="bottom" transform={`translate(0, ${styles.sets.h})`} />
          <text style={{ textAnchor: 'middle' }} transform={`translate(${styles.sets.w / 2}, ${styles.sets.h + 30})`}>
            Set Size
          </text>
        </g>
        <g transform={`translate(${styles.sets.w},${styles.intersections.h})`}>
          <Labels
            scales={scales}
            sets={sets}
            styles={styles}
            setSelection={setSelection}
            clearSelection={clearSelection}
          />
          <UpSetChart
            scales={scales}
            sets={sets}
            styles={styles}
            intersections={intersections}
            setSelection={setSelection}
            clearSelection={clearSelection}
          />
          <LabelsSelection scales={scales} styles={styles} selection={selection} />
          <UpSetSelectionChart scales={scales} sets={sets} styles={styles} selection={selection} />
        </g>
      </g>
      {children}
    </svg>
  );
}

export function InteractiveUpSet<T>(props: PropsWithChildren<UpSetProps<T>>) {
  const [selection, setSelection] = React.useState(null as ISet<any> | null);
  return <UpSet selection={selection} onSelectionChanged={setSelection} {...props} />;
}
