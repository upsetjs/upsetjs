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
  selection?: ISet<T>;
  onSelectionChanged?(selection?: ISet<T>): void;
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
  isSelected(s: ISet<any>): boolean;
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

function SetChart<T>({
  sets,
  scales,
  elemOverlap,
}: PropsWithChildren<{
  sets: ISets<T>;
  scales: UpSetScales;
  styles: UpSetStyles;
  elemOverlap: (s: ISet<any>) => number;
}>) {
  const width = scales.sets.x.range()[0];
  return (
    <g>
      {sets.map(d => (
        <g key={d.name} transform={`translate(0, ${scales.sets.y(d.name)})`}>
          <title>
            {d.name}: {d.cardinality}
          </title>
          <rect
            x={scales.sets.x(d.cardinality)}
            width={width - scales.sets.x(d.cardinality)}
            height={scales.sets.y.bandwidth()}
          />
          <rect
            x={scales.sets.x(elemOverlap(d))}
            width={width - scales.sets.x(elemOverlap(d))}
            height={scales.sets.y.bandwidth()}
            style={{ fill: 'orange' }}
          />
          <text
            x={scales.sets.x(d.cardinality)}
            dx="-1"
            y={scales.sets.y.bandwidth() / 2}
            style={{ textAnchor: 'end', dominantBaseline: 'central', fontSize: 'small' }}
          >
            {d.cardinality}
          </text>
        </g>
      ))}
    </g>
  );
}

function IntersectionChart<T>({
  intersections,
  scales,
  elemOverlap,
}: PropsWithChildren<{
  intersections: ISets<T>;
  scales: UpSetScales;
  styles: UpSetStyles;
  elemOverlap: (s: ISet<any>) => number;
}>) {
  const height = scales.intersections.y.range()[0];
  return (
    <g>
      {intersections.map(d => (
        <g key={d.name} transform={`translate(${scales.intersections.x(d.name)}, 0)`}>
          <title>
            {d.name}: {d.cardinality}
          </title>
          <rect
            y={scales.intersections.y(d.cardinality)}
            height={height - scales.intersections.y(d.cardinality)}
            width={scales.intersections.x.bandwidth()}
          />
          <rect
            y={scales.intersections.y(elemOverlap(d))}
            height={height - scales.intersections.y(elemOverlap(d))}
            width={scales.intersections.x.bandwidth()}
            style={{ fill: 'orange' }}
          />
          <text
            y={scales.intersections.y(d.cardinality)}
            dx="-1"
            x={scales.intersections.x.bandwidth() / 2}
            style={{ textAnchor: 'middle', fontSize: 'small' }}
          >
            {d.cardinality}
          </text>
        </g>
      ))}
    </g>
  );
}

function Labels<T>({
  sets,
  scales,
  styles,
  setSelection,
  clearSelection,
  isSelected,
}: PropsWithChildren<{ sets: ISets<T>; scales: UpSetScales; styles: UpSetStyles } & UpSetSelection>) {
  return (
    <g>
      {sets.map((d, i) => (
        <g
          key={d.name}
          transform={`translate(0, ${scales.sets.y(d.name)})`}
          onMouseEnter={() => setSelection(d)}
          onMouseLeave={clearSelection}
        >
          <rect
            width={styles.labels.w + styles.intersections.w}
            height={scales.sets.y.bandwidth()}
            style={{ fill: i % 2 === 1 ? '#eee' : 'transparent', stroke: isSelected(d) ? 'orange' : 'transparent' }}
          />
          <text
            x={styles.labels.w / 2}
            y={scales.sets.y.bandwidth() / 2}
            style={{ textAnchor: 'middle', dominantBaseline: 'central' }}
          >
            {d.name}
          </text>
        </g>
      ))}
    </g>
  );
}

function UpSetChart<T>({
  sets,
  intersections,
  scales,
  styles,
  setSelection,
  clearSelection,
  isSelected,
}: PropsWithChildren<
  { sets: ISets<T>; intersections: ISets<T>; scales: UpSetScales; styles: UpSetStyles } & UpSetSelection
>) {
  const cy = scales.sets.y.bandwidth() / 2;
  const cx = scales.intersections.x.bandwidth() / 2;
  const r = Math.min(cx, cy) * (1 - styles.padding);
  const height = scales.sets.y.range()[1];
  const rsets = sets.slice().reverse();

  return (
    <g transform={`translate(${styles.labels.w}, 0))`}>
      {intersections.map(d => {
        const sel = isSelected(d);
        return (
          <g key={d.name} transform={`translate(${scales.intersections.x(d.name)}, 0)`}>
            <title>{d.name}</title>
            <rect
              width={scales.intersections.x.bandwidth()}
              height={height}
              style={{ fill: 'transparent', stroke: sel ? 'orange' : 'transparent' }}
            />
            <g>
              {sets.map(s => {
                const has = d.sets.has(s);
                return (
                  <circle
                    key={s.name}
                    r={r}
                    cx={cx}
                    cy={scales.sets.y(s.name)! + cy}
                    style={{ fill: sel ? 'orange' : has ? 'black' : 'lightgray' }}
                    onMouseEnter={() => setSelection(d)}
                    onMouseLeave={clearSelection}
                  >
                    <title>{has ? s.name : d.name}</title>
                  </circle>
                );
              })}
            </g>
            <line
              x1={cx}
              y1={d.sets.size > 0 ? scales.sets.y(sets.find(p => d.sets.has(p))!.name)! + cy : 0}
              x2={cx}
              y2={d.sets.size > 0 ? scales.sets.y(rsets.find(p => d.sets.has(p))!.name)! + cy : 0}
              style={{ stroke: sel ? 'orange' : 'black', strokeWidth: r * 0.6 }}
            />
          </g>
        );
      })}
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
}: PropsWithChildren<UpSetProps<T>>) {
  const styles = defineStyle({ width, height, margin });
  const scales = generateScales(sets, intersections, styles);

  const [selection, setSelection] = useState(null as ISet<T> | null);
  const isSelected = (s: ISet<T>) => s === selection;
  const clearSelection = () => setSelection(null);
  const s = { isSelected, setSelection, clearSelection };
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
          <IntersectionChart scales={scales} intersections={intersections} styles={styles} elemOverlap={elemOverlap} />
          <D3Axis transform={`translate(0,${styles.sets.h})`} d3Scale={scales.intersections.y} orient="left" />
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
          <SetChart scales={scales} sets={sets} styles={styles} elemOverlap={elemOverlap} />
          <D3Axis d3Scale={scales.sets.x} orient="bottom" />
          <text style={{ textAnchor: 'middle' }} transform={`translate(${styles.sets.w / 2}, ${styles.sets.h + 30})`}>
            Set Size
          </text>
        </g>
        <g transform={`translate(${styles.sets.w},${styles.intersections.h})`}>
          <Labels scales={scales} sets={sets} styles={styles} {...s} />
          <UpSetChart scales={scales} sets={sets} styles={styles} intersections={intersections} {...s} />
        </g>
      </g>
      {children}
    </svg>
  );
}
